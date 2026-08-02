import { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import Button from '../components/common/Button';
import { useSkinStore, getSkinById } from '../store/useSkinStore';
import { useUserStore } from '../store/useUserStore';
import LoadingIndicator from '../components/common/LoadingIndicator';
import {
  KeywordExplanationAPI,
  KeywordQuizAPI,
  KeywordSubmitAPI,
  MainKeyword,
  KeywordQuiz,
  KeywordQuizOption,
  KeywordSubmit,
} from '../apis/home';
import { getErrorMessage } from '../utils/getErrorMessage';

// 제목 설정
const hasFinalConsonant = (char: string): boolean => {
  const code = char.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return false;
  return code % 28 !== 0;
};

const getTitleSuffix = (word: string): string => {
  const lastChar = word[word.length - 1];
  return hasFinalConsonant(lastChar) ? '이란?' : '란?';
};

// 문자열 파싱
const parseExplanation = (explanation: string) => {
  const sections = explanation
    .split('\n\n')
    .map((section) => section.trim())
    .filter(Boolean);

  if (sections.length === 0) {
    return { intro: '', paragraphs: [] as string[], summaryTitle: '', summaryPoints: [] as string[] };
  }

  const intro = sections[0];
  const hasSummary = sections.length > 1;
  const paragraphs = hasSummary ? sections.slice(1, -1) : [];
  const summaryLines = hasSummary
    ? sections[sections.length - 1]
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
  const summaryTitle = summaryLines[0] ?? '';
  const summaryPoints = summaryLines.slice(1);

  return { intro, paragraphs, summaryTitle, summaryPoints };
};

const KeywordQuizScreen = () => {
  const router = useRouter();
  const selectedSkinId = useSkinStore((state) => state.selectedSkinId);
  const mascot = getSkinById(selectedSkinId).image;
  // news_id까지 넘기기
  const { keyword_id, news_id } = useLocalSearchParams<{ keyword_id: string; news_id: string }>();
  const keywordId = Number(keyword_id);

  const quizAnswers = useUserStore((state) => state.quizAnswers);
  const quizResults = useUserStore((state) => state.quizResults);
  const answerQuizStore = useUserStore((state) => state.answerQuiz);
  const addPoints = useUserStore((state) => state.addPoints);

  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<MainKeyword>();
  const [quiz, setQuiz] = useState<KeywordQuiz>();
  // 이미 답변한 키워드를 재방문한 경우, 저장해둔 결과로 피드백을 그대로 복원
  const [submitResult, setSubmitResult] = useState<KeywordSubmit | undefined>(
    quizResults[keywordId],
  );

  const [step, setStep] = useState<'explanation' | 'quiz'>('explanation');

  // 설명 + 퀴즈 조회
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [explanationRes, quizRes] = await Promise.all([
          KeywordExplanationAPI(keywordId),
          KeywordQuizAPI(keywordId),
        ]);
        if (explanationRes.isSuccess) {
          setContent(explanationRes.result);
        }
        if (quizRes.isSuccess) {
          setQuiz(quizRes.result);
        }
      } catch (error) {
        Alert.alert('오류', getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    if (keyword_id) {
      fetchAllData();
    }
  }, [keyword_id]);

  const goToExplanation = () => setStep('explanation');
  const goToQuiz = () => setStep('quiz');

  // 재방문 1회 제한
  const alreadyAnswered = quizAnswers[keywordId] !== undefined;
  const answered = alreadyAnswered || submitResult !== undefined;

  // 키워드 퀴즈 채점 및 포인트 지급
  const handleSelect = async (optionNumber: number) => {
    if (answered || isLoading || !quiz) return;
    setIsLoading(true);
    try {
      const response = await KeywordSubmitAPI(keywordId, {
        quiz_id: quiz.id,
        selected_answer: optionNumber,
      });
      if (response.isSuccess) {
        setSubmitResult(response.result);
        answerQuizStore(keywordId, response.result);
        addPoints(response.result.point_result.earned_point);
      }
    } catch (error) {
      Alert.alert('오류', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionStyle = (optionNumber: number) => {
    if (!submitResult) return styles.optionDefault;
    if (optionNumber === submitResult.correct_answer) return styles.optionCorrect;
    if (optionNumber === submitResult.selected_answer) return styles.optionWrong;
    return styles.optionDefault;
  };

  const isOptionActive = (optionNumber: number) =>
    !!submitResult &&
    (optionNumber === submitResult.correct_answer || optionNumber === submitResult.selected_answer);

  const word = content?.word ?? '';
  const titleSuffix = word ? getTitleSuffix(word) : '';
  const { intro, paragraphs, summaryTitle, summaryPoints } = content
    ? parseExplanation(content.explanation)
    : { intro: '', paragraphs: [] as string[], summaryTitle: '', summaryPoints: [] as string[] };

  if (step === 'explanation') {
    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <View style={styles.mascotRow}>
          <Image source={mascot} style={styles.mascotImage} resizeMode="contain" />
          <View style={styles.titleBubble}>
            <View style={styles.highlightKeyword}>
              <Text style={styles.titleBubbleKeyword}>{word}</Text>
            </View>
            <Text style={styles.titleBubbleText}>{titleSuffix}</Text>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.introText}>{intro}</Text>
          {paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraphText}>
              {paragraph}
            </Text>
          ))}

          {summaryTitle ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>{summaryTitle}</Text>
            </View>
          ) : null}
          {summaryPoints.map((point) => (
            <Text key={point} style={styles.summaryPoint}>
              {point}
            </Text>
          ))}
        </View>

        <View style={styles.spacer} />
        <View style={styles.quizButtonWrap}>
          <Button label="퀴즈 풀기" variant={quiz ? 'filled' : 'disabled'} onPress={goToQuiz} />
        </View>
        {isLoading && <LoadingIndicator />}
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>키워드 퀴즈</Text>
      <Text style={styles.caption}>기회는 1번 뿐이니 신중하게 선택하세요!</Text>
      <Text style={styles.question}>{quiz?.question}</Text>

      <View style={styles.optionList}>
        {quiz?.options.map((option: KeywordQuizOption) => (
          <Pressable
            key={option.option_number}
            style={[styles.option, getOptionStyle(option.option_number)]}
            onPress={() => handleSelect(option.option_number)}
            disabled={answered || isLoading}
          >
            <Text
              style={[
                styles.optionText,
                isOptionActive(option.option_number) && styles.optionTextActive,
              ]}
            >
              {option.option_text}
            </Text>
          </Pressable>
        ))}
      </View>

      {submitResult && (
        <View
          style={[
            styles.feedbackBox,
            submitResult.is_correct ? styles.feedbackBoxCorrect : styles.feedbackBoxWrong,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {submitResult.is_correct ? '🎉 정답이에요!' : '❌ 정답이 아니에요'}
          </Text>
          <Text style={styles.feedbackDescription}>{submitResult.explanation}</Text>
        </View>
      )}

      <View style={styles.spacer} />
      {answered && (
        <View style={styles.buttonGroup}>
          <Button label="키워드 다시보기" variant="outlined" onPress={goToExplanation} />
          <Button 
            label="뉴스 보기" 
            variant="filled" 
            onPress={() => 
              router.push({
                pathname: "/news",
                params: {
                  newsId: news_id,
                },
              })
            } />
        </View>
      )}
      {isLoading && <LoadingIndicator />}
    </ScrollView>
  );
};

export default KeywordQuizScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 30,
    marginLeft: 10,
    marginBottom: 15,
  },
  mascotImage: {
    width: 135,
    height: 135,
  },
  titleBubble: {
    flexDirection: 'row',
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    paddingHorizontal: 50,
    paddingVertical: 13,
    marginBottom: 20,
  },
  highlightKeyword: {
    backgroundColor: colors.yellow400,
  },
  titleBubbleKeyword: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  titleBubbleText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  explanationCard: {
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    padding: 20,
  },
  introText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 20,
    marginTop: 16,
    lineHeight: 22,
  },
  paragraphText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 16,
    lineHeight: 27,
  },
  summaryBox: {
    alignSelf: 'flex-start',
    backgroundColor: colors.yellow400,
    paddingVertical: 0,
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  summaryTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  summaryPoint: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    lineHeight: 22,
    marginBottom: 4,
    marginLeft: 20,
  },
  quizButtonWrap: {
    marginTop: 24,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginTop: 70,
  },
  caption: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.gray400,
    marginBottom: 24,
  },
  question: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 30,
  },
  optionList: {
    gap: 18,
  },
  option: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionDefault: {
    backgroundColor: colors.background,
    borderColor: colors.blue400,
  },
  optionCorrect: {
    backgroundColor: colors.blue400,
    borderColor: colors.blue400,
  },
  optionWrong: {
    backgroundColor: colors.red100,
    borderColor: colors.red100,
  },
  optionText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
  optionTextActive: {
    color: colors.background,
  },
  feedbackBox: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginTop: 50,
  },
  feedbackBoxCorrect: {
    backgroundColor: colors.background,
    borderColor: colors.blue400,
  },
  feedbackBoxWrong: {
    backgroundColor: colors.background,
    borderColor: colors.red400,
  },
  feedbackTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    marginTop: 6,
    marginBottom: 6,
  },
  feedbackDescription: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    marginBottom: 6,
  },
  spacer: {
    flex: 1,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 12,
  },
});