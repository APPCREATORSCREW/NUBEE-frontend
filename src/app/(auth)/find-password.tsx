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
import { CircleLeft, VisibilityOn, VisibilityOff } from '../../components/icons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영어, 숫자, 특수문자 포함 10자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

type Step = 'verify' | 'reset';

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

const Field = ({ label, error, rightElement, ...inputProps }: FieldProps) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput style={styles.input} placeholderTextColor={colors.gray400} {...inputProps} />
      {rightElement}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const FindPasswordScreen = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [authCode, setAuthCode] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [touched, setTouched] = useState({ newPassword: false, confirmNewPassword: false });
  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const emailValid = EMAIL_REGEX.test(email);
  const newPasswordValid = PASSWORD_REGEX.test(newPassword);
  const confirmNewPasswordValid =
    confirmNewPassword.length > 0 && confirmNewPassword === newPassword;

  const handleBack = () => {
    if (step === 'reset') {
      setStep('verify');
      return;
    }
    router.back();
  };

  const handleSendEmail = () => {
    if (!name || !email) return;
    // API 연동 후 처리
    setEmailSent(true);
  };

  const handleVerifyCode = () => {
    if (!authCode) return;
    // API 연동 후 처리
    setStep('reset');
  };

  const handleResetPassword = () => {
    if (!newPasswordValid || !confirmNewPasswordValid) return;
    // API 연동 후 처리
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Pressable onPress={handleBack}>
            <CircleLeft />
          </Pressable>
          <Text style={styles.headerTitle}>비밀번호 찾기</Text>
        </View>

        {step === 'verify' ? (
          <>
            <Field label="이름" value={name} onChangeText={setName} />

            <Field
              label="이메일"
              placeholder="nubee@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              rightElement={
                <Pressable
                  style={[styles.pillButton, !emailValid && styles.pillButtonDisabled]}
                  onPress={handleSendEmail}
                  disabled={!emailValid}
                >
                  <Text style={styles.pillButtonLabel}>전송</Text>
                </Pressable>
              }
            />
            {emailSent && (
              <Text style={styles.helperText}>인증번호가 이메일로 전송되었습니다.</Text>
            )}

            {emailSent && (
              <Field
                label="인증번호"
                placeholder="인증번호를 입력해주세요"
                value={authCode}
                onChangeText={setAuthCode}
                rightElement={
                  <Pressable
                    style={[styles.pillButton, !authCode && styles.pillButtonDisabled]}
                    onPress={handleVerifyCode}
                    disabled={!authCode}
                  >
                    <Text style={styles.pillButtonLabel}>확인</Text>
                  </Pressable>
                }
              />
            )}
          </>
        ) : (
          <>
            <Field
              label="새 비밀번호"
              placeholder="영어, 숫자, 특수문자 포함 10자 이상"
              value={newPassword}
              onChangeText={setNewPassword}
              onBlur={markTouched('newPassword')}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              error={
                touched.newPassword && !newPasswordValid
                  ? '올바른 비밀번호 형식이 아닙니다.'
                  : undefined
              }
              rightElement={
                <Pressable onPress={() => setShowNewPassword((prev) => !prev)}>
                  {showNewPassword ? <VisibilityOn /> : <VisibilityOff />}
                </Pressable>
              }
            />

            <Field
              key="confirmNewPassword"
              label="새 비밀번호 확인"
              value={confirmNewPassword}
              placeholder="새 비밀번호를 다시 입력해주세요"
              onChangeText={setConfirmNewPassword}
              onBlur={markTouched('confirmNewPassword')}
              secureTextEntry={!showConfirmNewPassword}
              autoCapitalize="none"
              importantForAutofill="no"
              textContentType="none"
              error={
                touched.confirmNewPassword && !confirmNewPasswordValid
                  ? '비밀번호가 일치하지 않습니다.'
                  : undefined
              }
              rightElement={
                <Pressable onPress={() => setShowConfirmNewPassword((prev) => !prev)}>
                  {showConfirmNewPassword ? <VisibilityOn /> : <VisibilityOff />}
                </Pressable>
              }
            />

            <View style={styles.buttonContainer}>
              <Button
                label="비밀번호 재설정"
                variant={newPasswordValid && confirmNewPasswordValid ? 'filled' : 'disabled'}
                onPress={handleResetPassword}
              />
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FindPasswordScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 38,
  },
  headerTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginLeft: 12,
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
    marginTop: -16,
    marginBottom: 24,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.caption,
    color: colors.gray400,
  },
  pillButton: {
    backgroundColor: colors.yellow400,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillButtonDisabled: {
    backgroundColor: colors.gray400,
  },
  pillButtonLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
