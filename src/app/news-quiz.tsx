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
  const activeNewsId = Number(newsId);

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optionLineCount, setOptionLineCount] = useState<Record<number, number>>({});

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
            <Text
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines.length;

                setOptionLineCount((prev) => ({
                  ...prev,
                  [option.option_number]: lines,
                }));
              }}
              style={[
                styles.optionText,
                optionLineCount[option.option_number] === 1
                  ? styles.optionTextCenter
                  : styles.optionTextLeft,
                isOptionActive(option.option_number) && styles.optionTextActive,
              ]}
            >
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
  option: { minHeight: 52, borderRadius: 16, borderWidth: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  optionDefault: { backgroundColor: colors.background, borderColor: colors.blue400 },
  optionCorrect: { backgroundColor: colors.blue400, borderColor: colors.blue400 },
  optionWrong: { backgroundColor: colors.red100, borderColor: colors.red100 },
  optionText: { 
    fontFamily: fonts.family.regular, 
    fontSize: 16, 
    color: colors.black, 
    lineHeight: 22, 
    width: '100%' 
  },
  optionTextCenter: {
    textAlign: 'center',
  },
  optionTextLeft: {
    textAlign: 'left',
  },
  optionTextActive: { color: colors.background },
  feedbackBox: { borderRadius: 16, borderWidth: 2, padding: 16, marginTop: 30 },
  feedbackBoxCorrect: { backgroundColor: colors.background, borderColor: colors.blue400 },
  feedbackBoxWrong: { backgroundColor: colors.background, borderColor: colors.red400 },
  feedbackTitle: { fontFamily: fonts.family.bold, fontSize: 16, color: colors.black, marginBottom: 8 },
  feedbackDescription: { fontFamily: fonts.family.regular, fontSize: 15, color: colors.black, lineHeight: 22 },
  finishArea: { marginTop: 24 },
  finishText: { marginTop: 18, textAlign: "center", fontFamily: fonts.family.regular, fontSize: 15, color: colors.black },
});