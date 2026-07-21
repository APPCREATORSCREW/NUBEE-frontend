import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { useUserStore } from '../../store/useUserStore';
import { useSignupDraftStore } from '../../store/useSignupDraftStore';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { SignUpAPI, KeywordCountAPI } from '../../apis/auth';
import { getErrorMessage } from '../../utils/getErrorMessage';

const OPTIONS = [
  { count: 3, background: colors.yellow100, border: colors.yellow400 },
  { count: 4, background: colors.green100, border: colors.green400 },
  { count: 5, background: colors.blue100, border: colors.blue400 },
  { count: 6, background: colors.pink100, border: colors.pink400 },
];

const SelectKeywordScreen = () => {
  const router = useRouter();
  const setSettings = useUserStore((state) => state.setSettings);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const setDraft = useSignupDraftStore((state) => state.setDraft);
  const clearDraft = useSignupDraftStore((state) => state.clearDraft);
  const userflow = useSignupDraftStore((state) => state.draft.flow);
  const userData = useSignupDraftStore((state) => state.draft);

  // api 연동 - 회원가입 api / 키워드 api
  const handleStart = async () => {
    if (selectedCount === null || isLoading) return;
    
    if (userflow === 'signup') {
      setDraft({ preferredKeywordCount: selectedCount });
      setIsLoading(true);
      try{
        const { flow, ...signupPayload } = userData;

        if (
          !signupPayload.username ||
          !signupPayload.email ||
          !signupPayload.password ||
          !signupPayload.passwordConfirm ||
          !signupPayload.birthDate
        ) {
          Alert.alert('오류', '회원가입에 필요한 정보가 부족해요.');
          return;
        }

        const response = await SignUpAPI({
          username: signupPayload.username,
          email: signupPayload.email,
          password: signupPayload.password,
          passwordConfirm: signupPayload.passwordConfirm,
          birthDate: signupPayload.birthDate,
          preferredKeywordCount: selectedCount,
          parentEmail: signupPayload.parentEmail ?? null,
        });
        clearDraft();
        // api 연동 - 프로필 조회 api -> 전역 관리
        router.replace('/home');
      }catch(error){
        Alert.alert('오류', getErrorMessage(error));
      }finally{
        setIsLoading(false);
      }
    }else{
      setIsLoading(true);
      try{
        const response = await KeywordCountAPI({ preferredKeywordCount: selectedCount });
        setSettings({ keywordCount: selectedCount });
        router.replace('/home');
        // api 연동 - 프로필 조회 api -> 전역관리
      }catch(error){
        Alert.alert('오류', getErrorMessage(error));
      }finally{
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        하루에 볼 <Text style={styles.titleHighlight}>키워드</Text>
        {'\n'}개수를 선택해 주세요
      </Text>

      <View style={styles.grid}>
        {OPTIONS.map((option) => {
          const isSelected = selectedCount === option.count;
          return (
            <Pressable
              key={option.count}
              style={[
                styles.card,
                { backgroundColor: isSelected ? option.border : option.background },
                isSelected && { borderColor: option.border },
              ]}
              onPress={() => setSelectedCount(option.count)}
            >
              <Text style={styles.cardLabel}>{option.count}개</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label="시작하기"
          variant={selectedCount !== null ? 'filled' : 'disabled'}
          onPress={handleStart}
        />
      </View>
      {isLoading && <LoadingIndicator fullScreen />}
    </View>
  );
};

export default SelectKeywordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginTop: 60,
    marginBottom: 40,
  },
  titleHighlight: {
    color: colors.yellow400,
  },
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  card: {
    width: '48%',
    height: '48%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 65,
  },
});
