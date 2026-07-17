import { ReactNode, useState } from "react";
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
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import Button from "../components/common/Button";
import { CircleLeft, VisibilityOn, VisibilityOff } from "../components/icons";
import { Shadow } from "react-native-shadow-2";

// 영어, 숫자, 특수문자 포함 10자 이상
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

const Field = ({ label, error, rightElement, ...inputProps }: FieldProps) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray400}
        {...inputProps}
        cursorColor={colors.yellow400}
      />
      {rightElement}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmNewPassword: false,
  });
  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const newPasswordValid = PASSWORD_REGEX.test(newPassword);
  const confirmNewPasswordValid =
    confirmNewPassword.length > 0 && confirmNewPassword === newPassword;
  const canSubmit =
    currentPassword.length > 0 && newPasswordValid && confirmNewPasswordValid;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // 비밀번호 변경 API 연동은 추후 작업
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
              <Shadow distance={2} startColor="#00000020">
                <View style={styles.iconRadius}>
                  <CircleLeft />
                </View>
              </Shadow>
            </Pressable>
            <Text style={styles.headerTitle}>비밀번호 변경</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Field
            label="기존 비밀번호"
            placeholder="기존 비밀번호를 입력해주세요"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry={!showCurrentPassword}
            autoCapitalize="none"
            rightElement={
              <Pressable
                onPress={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? <VisibilityOn /> : <VisibilityOff />}
              </Pressable>
            }
          />

          <Field
            label="새 비밀번호"
            placeholder="영어, 숫자, 특수문자 포함 10자 이상"
            value={newPassword}
            onChangeText={setNewPassword}
            onBlur={markTouched("newPassword")}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
            error={
              touched.newPassword && !newPasswordValid
                ? "올바른 비밀번호 형식이 아닙니다."
                : undefined
            }
            rightElement={
              <Pressable onPress={() => setShowNewPassword((prev) => !prev)}>
                {showNewPassword ? <VisibilityOn /> : <VisibilityOff />}
              </Pressable>
            }
          />

          <Field
            label="새 비밀번호 확인"
            placeholder="새 비밀번호를 다시 입력해주세요"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            onBlur={markTouched("confirmNewPassword")}
            secureTextEntry={!showConfirmNewPassword}
            autoCapitalize="none"
            importantForAutofill="no"
            textContentType="none"
            error={
              touched.confirmNewPassword && !confirmNewPasswordValid
                ? "비밀번호가 일치하지 않습니다."
                : undefined
            }
            rightElement={
              <Pressable
                onPress={() => setShowConfirmNewPassword((prev) => !prev)}
              >
                {showConfirmNewPassword ? <VisibilityOn /> : <VisibilityOff />}
              </Pressable>
            }
          />
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            label="변경하기"
            variant={canSubmit ? "filled" : "disabled"}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 38,
  },
  iconRadius: {
    borderRadius: 23,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
  },
  headerSpacer: {
    width: 46,
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
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.yellow100,
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
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.red400,
  },
  buttonContainer: {
    paddingBottom: 80,
  },
});
