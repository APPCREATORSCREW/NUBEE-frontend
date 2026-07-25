
/*import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import Button from '../components/common/Button';
import { useUserStore } from '../store/useUserStore';

interface KeywordContent {
  title: string;
  intro: string;
  paragraphs: string[];
  summaryTitle: string;
  summaryPoints: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}


const KEYWORD_CONTENT: Record<string, KeywordContent> = {
  금리: {
    title: '뉴스 퀴즈',
    intro: '한국 성장률 전망과 금리 인상에 대한 내용을 확인해봐요!',
    paragraphs: [
      '우리나라 경제가 빠르게 성장하면서 반도체 수출이 늘고 있어요.',
      '하지만 경제가 너무 빠르게 성장하면 물건 값도 함께 오를 수 있어요.',
      '이럴 때 한국은행은 물가를 안정시키기 위해 금리를 올릴 수 있어요.',
    ],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: [
      '경제 성장 → 물가 상승 가능',
      '금리 상승 → 사람들이 돈을 덜 씀',
      '금리 조절 → 물가 안정에 도움',
    ],
    quiz: {
      question: '한국은행이 금리를 올리려는 이유는 무엇인가요?',
      options: [
        '반도체를 더 많이 팔기 위해서',
        '물건 값이 너무 오르는 걸 막기 위해서',
        '온라인 쇼핑몰을 활발하게 하기 위해서',
        '외국 은행들이 요청해서',
      ],
      correctIndex: 1,
      explanation:
        '경제가 빠르게 성장하면 물건 값도 같이 오르는데, 금리를 올리면 사람들이 돈을 덜 쓰게 되어 물가가 안정돼요. 마치 너무 뜨거운 냄비의 불을 줄이는 것처럼요!',
    },
  },

};

const KeywordQuizScreen = () => {
  const router = useRouter();

  const { keyword } = useLocalSearchParams<{ keyword?: string }>();
  const activeKeyword = keyword ?? '금리';
  const content = KEYWORD_CONTENT[activeKeyword] ?? KEYWORD_CONTENT['금리'];
  // 제목만 하이라이트
  const titleRest = content.title.startsWith(activeKeyword)
    ? content.title.slice(activeKeyword.length)
    : content.title;

  const quizAnswers = useUserStore((state) => state.quizAnswers);
  const answerQuiz = useUserStore((state) => state.answerQuiz);
  const selectedIndex = quizAnswers[activeKeyword] ?? null;

  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === content.quiz.correctIndex;


  const handleSelect = (index: number) => {
    if (answered) return; // 전역 상태로 1회 제한 관리
    answerQuiz(activeKeyword, index);
  };

  const getOptionStyle = (index: number) => {
    if (!answered) return styles.optionDefault;
    if (index === content.quiz.correctIndex) return styles.optionCorrect;
    if (index === selectedIndex) return styles.optionWrong;
    return styles.optionDefault;
  };

  const isOptionActive = (index: number) =>
    answered && (index === content.quiz.correctIndex || index === selectedIndex);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>퀴즈</Text>
      <Text style={styles.question}>{content.quiz.question}</Text>

      <View style={styles.optionList}>
        {content.quiz.options.map((option, index) => (
          <Pressable
            key={option}
            style={[styles.option, getOptionStyle(index)]}
            onPress={() => handleSelect(index)}
            disabled={answered}
          >
            <Text style={[styles.optionText, isOptionActive(index) && styles.optionTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      {answered && (
        <View
          style={[
            styles.feedbackBox,
            isCorrect ? styles.feedbackBoxCorrect : styles.feedbackBoxWrong,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {isCorrect ? '🎉 정답이에요!' : '❌ 정답이 아니에요'}
          </Text>
          <Text style={styles.feedbackDescription}>{content.quiz.explanation}</Text>
        </View>
      )}

      {answered && (
        <View style={styles.finishArea}>
          <Button
            label="홈으로 돌아가기"
            variant="filled"
            onPress={() => router.push("/")}
          />

          <Text style={styles.finishText}>
            {isCorrect
              ? "학습 완료! +1P 📚"
              : "😢 아쉬워요!"}
          </Text>
        </View>
      )}
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
  
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginTop: 70,
    paddingBottom: 20,
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

  finishArea: {
    marginTop: 24,
  },

  finishText: {
    marginTop: 18,
    textAlign: "center",

    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,

    color: colors.black,
  },
});*/

import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import Button from '../components/common/Button';
import { getNewsQuiz, submitNewsQuiz } from '../apis/newsApi';

interface Option {
  option_number: number;
  option_text: string;
}

interface QuizData {
  id: number;
  news_id: number;
  keyword_id: number | null;
  quiz_type: string;
  question: string;
  options: Option[];
}

interface QuizResult {
  quiz_id: number;
  selected_answer: number;
  correct_answer: number;
  is_correct: boolean;
  explanation: string;
  is_completed: boolean;
  point_result: {
    earned_point: number;
    current_point: number;
  };
}

const KeywordQuizScreen = () => {
  const router = useRouter();
  const { newsId } = useLocalSearchParams<{ newsId?: string }>();
  const activeNewsId = newsId ? Number(newsId) : 24;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [activeNewsId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const data = await getNewsQuiz(activeNewsId);
      if (data.isSuccess) {
        setQuiz(data.result);
      }
    } catch (error: any) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (optionNumber: number) => {
    if (quizResult || !quiz) return; // 이미 제출된 경우 방지

    try {
      setIsSubmitting(true);
      setSelectedIndex(optionNumber);
      const data = await submitNewsQuiz(activeNewsId, quiz.id, optionNumber);
      if (data.isSuccess) {
        setQuizResult(data.result);
      }
    } catch (error: any) {
      Alert.alert("알림", error.message);
      setSelectedIndex(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <ScrollView contentContainerStyle={[styles.container, styles.center]} style={styles.flex}>
        <ActivityIndicator size="large" color={colors.black} />
      </ScrollView>
    );
  }

  const answered = quizResult !== null;

  const getOptionStyle = (optionNumber: number) => {
    if (!answered) return styles.optionDefault;
    if (optionNumber === quizResult.correct_answer) return styles.optionCorrect;
    if (optionNumber === selectedIndex) return styles.optionWrong;
    return styles.optionDefault;
  };

  const isOptionActive = (optionNumber: number) =>
    answered && (optionNumber === quizResult.correct_answer || optionNumber === selectedIndex);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>퀴즈</Text>
      <Text style={styles.question}>{quiz.question}</Text>

      <View style={styles.optionList}>
        {quiz.options.map((option) => (
          <Pressable
            key={option.option_number}
            style={[styles.option, getOptionStyle(option.option_number)]}
            onPress={() => handleSelect(option.option_number)}
            disabled={answered || isSubmitting}
          >
            <Text style={[styles.optionText, isOptionActive(option.option_number) && styles.optionTextActive]}>
              {option.option_text}
            </Text>
          </Pressable>
        ))}
      </View>

      {answered && (
        <View
          style={[
            styles.feedbackBox,
            quizResult.is_correct ? styles.feedbackBoxCorrect : styles.feedbackBoxWrong,
          ]}
        >
          <Text style={styles.feedbackTitle}>
            {quizResult.is_correct ? '🎉 정답이에요!' : '❌ 정답이 아니에요'}
          </Text>
          <Text style={styles.feedbackDescription}>{quizResult.explanation}</Text>
        </View>
      )}

      {answered && (
        <View style={styles.finishArea}>
          <Button
            label="홈으로 돌아가기"
            variant="filled"
            onPress={() => router.push("/")}
          />

          <Text style={styles.finishText}>
            {quizResult.is_correct
              ? `학습 완료! +${quizResult.point_result.earned_point}P 📚 (현재 포인트: ${quizResult.point_result.current_point}P)`
              : "😢 아쉬워요!"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

export default KeywordQuizScreen;

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  container: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontFamily: fonts.family.bold, fontSize: 24, color: colors.black, marginTop: 50, paddingBottom: 20 },
  question: { fontFamily: fonts.family.bold, fontSize: 20, color: colors.black, marginBottom: 30, lineHeight: 28 },
  optionList: { gap: 18 },
  option: { minHeight: 52, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  optionDefault: { backgroundColor: colors.background, borderColor: colors.blue400 },
  optionCorrect: { backgroundColor: colors.blue400, borderColor: colors.blue400 },
  optionWrong: { backgroundColor: colors.red100, borderColor: colors.red100 },
  optionText: { fontFamily: fonts.family.regular, fontSize: 16, color: colors.black, lineHeight: 22, textAlign: 'center' },
  optionTextActive: { color: colors.background },
  feedbackBox: { borderRadius: 16, borderWidth: 2, padding: 16, marginTop: 30 },
  feedbackBoxCorrect: { backgroundColor: colors.background, borderColor: colors.blue400 },
  feedbackBoxWrong: { backgroundColor: colors.background, borderColor: colors.red400 },
  feedbackTitle: { fontFamily: fonts.family.bold, fontSize: 16, color: colors.black, marginBottom: 8 },
  feedbackDescription: { fontFamily: fonts.family.regular, fontSize: 15, color: colors.black, lineHeight: 22 },
  finishArea: { marginTop: 24 },
  finishText: { marginTop: 18, textAlign: "center", fontFamily: fonts.family.regular, fontSize: 15, color: colors.black },
});