import { ReactNode, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { CheckEnabled, CheckDisabled } from '../../components/icons';
import { SignUpAPI } from '../../apis/auth';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { useUserStore } from '../../store/useUserStore';
import { tokenStorage } from '../../utils/tokenStorage';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영어, 숫자, 특수문자 포함 10자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

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

  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    passwordConfirm: false,
  });
  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const usernameValid = username.trim().length > 0;
  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const passwordConfirmValid = passwordConfirm.length > 0 && passwordConfirm === password;

  const canSubmit = usernameValid && emailValid && passwordValid && passwordConfirmValid;
  
  const handleSubmit =  async() => {
    try{
      const response = await SignUpAPI({ username, email, password, passwordConfirm });
      const { accessToken, refreshToken } = response.result;

      useUserStore.getState().setAccessToken(accessToken);
      tokenStorage.saveRefreshToken(refreshToken);
    } catch (error) {
      Alert.alert('오류', getErrorMessage(error));
    }
    router.push({ pathname: '/birth-date' });
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>회원가입</Text>

        <FieldInput label="이름" value={username} onChangeText={setName} valid={usernameValid} />

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
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          onBlur={markTouched('passwordConfirm')}
          secureTextEntry
          autoCapitalize="none"
          valid={passwordConfirmValid}
          error={
            touched.passwordConfirm && !passwordConfirmValid
              ? '비밀번호가 일치하지 않습니다.'
              : undefined
          }
        />

        <View style={{ flex: 1 }} />
        <View style={styles.buttonContainer}>
          <Button
            label="다음"
            variant={canSubmit ? 'filled' : 'disabled'}
            onPress={handleSubmit}
          />
        </View>
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
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginBottom: 50,
    marginTop: 60,
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
  buttonContainer: {
    marginBottom: 65,
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
});
