import { ReactNode, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import WheelPicker from 'react-native-wheely';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { CheckEnabled, CheckDisabled } from '../../components/icons';
import { useSignupDraftStore } from '../../store/useSignupDraftStore';
import { BirthDateAPI, ParentEmailSendAPI, ParentEmailVerifyAPI } from '../../apis/auth';
import LoadingIndicator from '../../components/common/LoadingIndicator';

// 카카오 리디렉션 시 flow: null
// 일반 회원가입 flow: SignupFlow

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BIRTH_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MINOR_AGE_THRESHOLD = 14;
const DEFAULT_BIRTH_DATE = new Date(2010, 0, 1);
const MIN_BIRTH_DATE = new Date(1950, 0, 1);

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


const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// 인증번호 유효시간 (전송/재전송 시점부터 5분)
const RESEND_INTERVAL_MS = 5 * 60 * 1000;

const useResendTimer = () => {
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (sentAt === null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [sentAt]);

  const remainingMs = sentAt === null ? 0 : Math.max(RESEND_INTERVAL_MS - (now - sentAt), 0);
  const expired = sentAt !== null && remainingMs === 0;
  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const label = `${minutes}:${String(seconds).padStart(2, '0')}`;

  const start = () => {
    setSentAt(Date.now());
    setNow(Date.now());
  };

  return { expired, label, start };
};

const clampToRange = (date: Date, minimumDate: Date, maximumDate: Date) => {
  if (date < minimumDate) return minimumDate;
  if (date > maximumDate) return maximumDate;
  return date;
};

interface BirthDateWheelPickerProps {
  date: Date;
  minimumDate: Date;
  maximumDate: Date;
  onDateChange: (date: Date) => void;
}

const BirthDateWheelPicker = ({
  date,
  minimumDate,
  maximumDate,
  onDateChange,
}: BirthDateWheelPickerProps) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = minimumDate.getFullYear(); y <= maximumDate.getFullYear(); y++) list.push(y);
    return list;
  }, [minimumDate, maximumDate]);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(
    () => Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1),
    [year, month],
  );

  const applyChange = (nextYear: number, nextMonth: number, nextDay: number) => {
    const clampedDay = Math.min(nextDay, daysInMonth(nextYear, nextMonth));
    const nextDate = new Date(nextYear, nextMonth, clampedDay);
    onDateChange(clampToRange(nextDate, minimumDate, maximumDate));
  };

  return (
    <View style={styles.wheelRow}>
      <WheelPicker
        selectedIndex={years.indexOf(year)}
        options={years.map((y) => `${y}년`)}
        onChange={(index) => applyChange(years[index], month, day)}
        containerStyle={styles.wheelColumn}
        itemHeight={44}
        selectedIndicatorStyle={styles.wheelIndicator}
        itemTextStyle={styles.wheelItemText}
      />
      <WheelPicker
        selectedIndex={month}
        options={months.map((m) => `${m}월`)}
        onChange={(index) => applyChange(year, index, day)}
        containerStyle={styles.wheelColumn}
        itemHeight={44}
        selectedIndicatorStyle={styles.wheelIndicator}
        itemTextStyle={styles.wheelItemText}
      />
      <WheelPicker
        selectedIndex={day - 1}
        options={days.map((d) => `${d}일`)}
        onChange={(index) => applyChange(year, month, index + 1)}
        containerStyle={styles.wheelColumn}
        itemHeight={44}
        selectedIndicatorStyle={styles.wheelIndicator}
        itemTextStyle={styles.wheelItemText}
      />
    </View>
  );
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

const BirthDateScreen = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<'birthdate' | 'parent'>('birthdate');
  const [birthDate, setBirthDate] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerDate, setPickerDate] = useState(DEFAULT_BIRTH_DATE);

  const [parentEmail, setParentEmail] = useState('');
  const [parentEmailSent, setParentEmailSent] = useState(false);
  const [parentAuthCode, setParentAuthCode] = useState('');
  const [parentVerified, setParentVerified] = useState(false);
  const parentEmailTimer = useResendTimer();

  const [touched, setTouched] = useState({ parentEmail: false });

  const setDraft = useSignupDraftStore((state) => state.setDraft);
  const userflow = useSignupDraftStore((state) => state.draft.flow);

  const markTouched = (field: keyof typeof touched) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const birthDateValid = BIRTH_DATE_REGEX.test(birthDate);
  const parentEmailValid = EMAIL_REGEX.test(parentEmail);

  const age = birthDateValid ? getAge(birthDate) : null;
  const isMinor = age !== null && age < MINOR_AGE_THRESHOLD;

  const canSubmit = birthDateValid && (!isMinor || parentVerified);

  const title = step === 'parent' ? '보호자 동의가 필요해요' : '생년월일을 입력해주세요';

  const isNextStep = step === 'birthdate' && isMinor;
  const primaryLabel = isNextStep ? '다음' : '완료';
  const primaryEnabled = isNextStep ? birthDateValid : canSubmit;

  const openPicker = () => {
    setPickerDate(birthDateValid ? new Date(birthDate) : DEFAULT_BIRTH_DATE);
    setPickerVisible(true);
  };

  const confirmPicker = () => {
    setBirthDate(formatDate(pickerDate));
    setPickerVisible(false);
  };

  // api 연동 - 부모님 이메일 전송
  const handleSendParentEmail = async () => {
    if (!parentEmailValid || isLoading) return;
    setIsLoading(true);
    try{
      const response = await ParentEmailSendAPI({ parentEmail });
      setParentEmailSent(true);
      parentEmailTimer.start();
    }
    catch(error){
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  };

  // api 연동 - 부모님 이메일 확인
  const handleVerifyParentEmail = async () => {
    if (!parentAuthCode || isLoading) return;
    setIsLoading(true);
    try{
      const response = await ParentEmailVerifyAPI({ email: parentEmail, code: parentAuthCode });
      setParentVerified(true);

      if (userflow === 'signup') {
      setDraft({ parentEmail, birthDate });
      }

    }
    catch(error){
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    router.replace('/tutorial');
  };


  // api 연동 - 생년월일
  const handlePrimaryPress = async () => {
    if (isLoading) return;

    if (isNextStep) {
      if (!birthDateValid) return;

      if (userflow === 'signup') {
        setDraft({ birthDate });
      } else {
        setIsLoading(true);
        try {
          const response = await BirthDateAPI({ birthDate });
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      setStep('parent');
      return;
    }

    if (userflow === 'signup') {
      setDraft({ birthDate, parentEmail: null });
    }
    else{
      setIsLoading(true);
      try{
        const response = await BirthDateAPI({ birthDate });
      }
      catch(error){
        console.log(error);
      }
      finally{
        setIsLoading(false);
      }
    }
    handleSubmit();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{title}</Text>

        {step === 'birthdate' && (
          // 생년월일 피커
          <Pressable style={styles.fieldContainer} onPress={openPicker}>
            <Text style={styles.label}>생년월일</Text>
            <View style={styles.inputWrapper}>
              <Text style={birthDate ? styles.input : styles.placeholderText}>
                {birthDate || 'YYYY-MM-DD'}
              </Text>
              {birthDateValid ? <CheckEnabled /> : <CheckDisabled />}
            </View>
          </Pressable>
        )}

        {step === 'parent' && (
          <View style={styles.parentSection}>
            <FieldInput
              label="보호자 이메일"
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
                  style={[styles.pillButton, !parentEmailValid && styles.pillButtonDisabled]}
                  onPress={handleSendParentEmail}
                  disabled={!parentEmailValid}
                >
                  <Text style={styles.pillButtonLabel}>
                    {parentEmailTimer.expired ? '재전송' : '전송'}
                  </Text>
                </Pressable>
              }
            />
            {parentEmailSent && (
              <Text style={styles.helperText}>보호자 동의 메일이 전송되었습니다.</Text>
            )}

            {parentEmailSent && (
              <>
                <FieldInput
                  label="인증번호"
                  placeholder="인증번호를 입력해주세요"
                  value={parentAuthCode}
                  onChangeText={setParentAuthCode}
                  rightElement={
                    <Pressable
                      style={[styles.pillButton, !parentAuthCode && styles.pillButtonDisabled]}
                      onPress={handleVerifyParentEmail}
                      disabled={!parentAuthCode}
                    >
                      <Text style={styles.pillButtonLabel}>확인</Text>
                    </Pressable>
                  }
                />
                {!parentVerified && (
                  <Text style={parentEmailTimer.expired ? styles.timerTextExpired : styles.helperText}>
                    {parentEmailTimer.expired
                      ? '인증번호가 만료되었어요. 재전송해주세요.'
                      : `남은 시간 ${parentEmailTimer.label}`}
                  </Text>
                )}
                {parentVerified && (
                  <Text style={styles.helperText}>동의가 완료되었습니다.</Text>
                )}
              </>
            )}
          </View>
        )}
        
        <View style={styles.spacer} />
        <View style={styles.buttonContainer}>
          <Button
            label={primaryLabel}
            variant={primaryEnabled ? 'filled' : 'disabled'}
            onPress={handlePrimaryPress}
          />
        </View>
      </ScrollView>

      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>날짜 선택</Text>
              <Pressable onPress={() => setPickerVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            <BirthDateWheelPicker
              date={pickerDate}
              minimumDate={MIN_BIRTH_DATE}
              maximumDate={new Date()}
              onDateChange={setPickerDate}
            />

            <Button label="확인" variant="filled" onPress={confirmPicker} />
          </View>
        </View>
      </Modal>
      {isLoading && <LoadingIndicator fullScreen />}
    </KeyboardAvoidingView>
  );
};

export default BirthDateScreen;

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
  spacer: {
    flex: 1,
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
  placeholderText: {
    flex: 1,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.gray400,
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
  timerTextExpired: {
    marginTop: -16,
    marginBottom: 24,
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.caption,
    color: colors.red400,
  },
  parentSection: {
    marginBottom: 24,
  },
  pillButton: {
    backgroundColor: colors.yellow400,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillButtonDisabled: {
    backgroundColor: colors.gray100,
  },
  pillButtonLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(44, 44, 44, 0.4)',
  },
  modalSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  modalClose: {
    fontSize: fonts.size.title,
    color: colors.black,
  },
  wheelRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    gap: 13,
    backgroundColor: colors.background,
  },
  wheelColumn: {
    flex: 1,
  },
  wheelIndicator: {
    backgroundColor: colors.yellow100,
    borderRadius: 16,
  },
  wheelItemText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});
