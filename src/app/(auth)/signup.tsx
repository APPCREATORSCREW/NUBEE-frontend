import { ReactNode, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { CheckEnabled, CheckDisabled } from '../../components/icons';

// 배포 환경 설정 후 실제 base URL로 교체 필요
const API_BASE_URL = '';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영어, 숫자, 특수문자 포함 10자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;
const BIRTH_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MINOR_AGE_THRESHOLD = 14;

const getAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
};

interface FieldInputProps extends TextInputProps {
  label: string;
  error?: string;
  valid?: boolean;
  rightElement?: ReactNode;
}

const FieldInput = ({ label, error, valid, rightElement, ...inputProps }: FieldInputProps) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput style={styles.input} placeholderTextColor={colors.gray400} {...inputProps} />
      {rightElement ?? (valid ? <CheckEnabled /> : <CheckDisabled />)}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const SignupScreen = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentEmailSent, setParentEmailSent] = useState(false);
  // API 명세서 미확정
  const [parentVerified] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    birthDate: false,
    parentEmail: false,
  });
  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const nameValid = name.trim().length > 0;
  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const confirmPasswordValid = confirmPassword.length > 0 && confirmPassword === password;
  const birthDateValid = BIRTH_DATE_REGEX.test(birthDate);
  const parentEmailValid = EMAIL_REGEX.test(parentEmail);

  const age = birthDateValid ? getAge(birthDate) : null;
  const isMinor = age !== null && age < MINOR_AGE_THRESHOLD;

  const allFieldsValid =
    nameValid && emailValid && passwordValid && confirmPasswordValid && birthDateValid;
  const canSubmit = allFieldsValid && (!isMinor || parentVerified);

  const handleSendParentEmail = async () => {
    if (!parentEmailValid) return;
    // API 명세서 미확정
    await fetch(`${API_BASE_URL}/auth/parent/email/send/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: parentEmail }),
    });
    setParentEmailSent(true);
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, birthDate }),
    });
    if (!response.ok) return;
    router.replace('/tutorial');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>회원가입</Text>

        <FieldInput label="이름" value={name} onChangeText={setName} valid={nameValid} />

        <FieldInput
          label="이메일"
          placeholder="nubee@example.com"
          value={email}
          onChangeText={setEmail}
          onBlur={markTouched('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          valid={emailValid}
          error={touched.email && !emailValid ? '유효한 이메일 주소가 아닙니다.' : undefined}
        />

        <FieldInput
          label="비밀번호"
          placeholder="영어, 숫자, 특수문자 포함 10자 이상"
          value={password}
          onChangeText={setPassword}
          onBlur={markTouched('password')}
          secureTextEntry
          autoCapitalize="none"
          valid={passwordValid}
          error={touched.password && !passwordValid ? '올바른 비밀번호 형식이 아닙니다.' : undefined}
        />

        <FieldInput
          label="비밀번호 확인"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={markTouched('confirmPassword')}
          secureTextEntry
          autoCapitalize="none"
          valid={confirmPasswordValid}
          error={
            touched.confirmPassword && !confirmPasswordValid
              ? '비밀번호가 일치하지 않습니다.'
              : undefined
          }
        />

        <FieldInput
          label="생년월일"
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChangeText={setBirthDate}
          onBlur={markTouched('birthDate')}
          valid={birthDateValid}
        />

        {isMinor && (
          <View style={styles.parentSection}>
            <Text style={styles.parentTitle}>보호자 동의 필요</Text>
            <FieldInput
              label="부모님 이메일"
              placeholder="nubee@example.com"
              value={parentEmail}
              onChangeText={setParentEmail}
              onBlur={markTouched('parentEmail')}
              keyboardType="email-address"
              autoCapitalize="none"
              error={
                touched.parentEmail && !parentEmailValid
                  ? '유효한 이메일 주소가 아닙니다.'
                  : undefined
              }
              rightElement={
                <Pressable
                  style={[styles.sendButton, !parentEmailValid && styles.sendButtonDisabled]}
                  onPress={handleSendParentEmail}
                  disabled={!parentEmailValid}
                >
                  <Text style={styles.sendButtonLabel}>전송</Text>
                </Pressable>
              }
            />
            {parentEmailSent && (
              <Text style={styles.helperText}>보호자 동의 메일이 전송되었습니다.</Text>
            )}
          </View>
        )}

        <Button
          label="회원가입"
          variant={canSubmit ? 'filled' : 'disabled'}
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginBottom: 32,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: colors.yellow400,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
  errorText: {
    marginTop: 4,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.caption,
    color: colors.red400,
  },
  helperText: {
    marginTop: 4,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.caption,
    color: colors.gray400,
  },
  parentSection: {
    marginBottom: 24,
  },
  parentTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: colors.yellow400,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  sendButtonLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
});
