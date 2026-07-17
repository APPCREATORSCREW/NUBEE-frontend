import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Image,
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

const mascot = require('../../../assets/skins/skin_origin.png');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영어, 숫자, 특수문자 포함 10자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

const Field = ({ label, error, ...inputProps }: FieldProps) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput style={styles.input} placeholderTextColor={colors.gray400} {...inputProps} />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const emailValid = EMAIL_REGEX.test(email);
  const passwordValid = PASSWORD_REGEX.test(password);
  const canSubmit = emailValid && passwordValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // UI 작업 단계, 로그인 API 연동 후 처리
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={mascot} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.title}>로그인</Text>

        <View style={styles.fieldContainer}>
          <Field
            label="이메일"
            placeholder="nubee@example.com"
            value={email}
            onChangeText={setEmail}
            onBlur={markTouched('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && !emailValid ? '유효한 이메일 주소가 아닙니다.' : undefined}
          />

          <Field
            label="비밀번호"
            placeholder="영어, 숫자, 특수문자 포함 10자 이상"
            value={password}
            onChangeText={setPassword}
            onBlur={markTouched('password')}
            secureTextEntry
            autoCapitalize="none"
            error={touched.password && !passwordValid ? '올바른 비밀번호 형식이 아닙니다.' : undefined}
          />
        </View>

        <Button label="로그인" variant={canSubmit ? 'filled' : 'disabled'} onPress={handleSubmit}  />

        <View style={styles.linkRow}>
          <Pressable onPress={() => router.push('/find-password')}>
            <Text style={styles.linkText}>비밀번호 찾기</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>회원가입</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.background,
    alignItems: 'stretch',
  },
  mascot: {
    width: 140,
    height: 140,
    marginTop: 73,
    alignSelf: 'center',
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginTop: 16,
    marginBottom: 52,
    alignSelf: 'center',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 28,
  },
  label: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    marginBottom: 8,
  },
  inputWrapper: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.yellow100,
  },
  input: {
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  linkText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
    marginTop : 5,
    marginLeft: 30,
    marginRight: 30,
  },
});
