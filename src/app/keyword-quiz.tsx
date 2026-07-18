import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import Button from '../components/common/Button';
import { useSkinStore, getSkinById } from '../store/useSkinStore';
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

// 금리 제외 나머지 키워드는 임시 데이터 // api 연동
const KEYWORD_CONTENT: Record<string, KeywordContent> = {
  금리: {
    title: '금리란?',
    intro: '금리는 돈을 빌릴 때 내는 사용료예요!',
    paragraphs: [
      '예를 들어볼게요.\n친구한테 1000원을 빌렸어요. 한 달 뒤에 갚을 때 1100원을 돌려줬어요. 그 추가된 100원이 바로 이자고, 이자가 얼마나 되는지 나타내는 비율이 금리예요.',
      '금리가 높을 때 은행에서 돈을 빌리면, 추가되는 금액이 많아지기 때문에 사람들이 돈을 덜 빌리게 돼요.',
      '금리가 낮으면? 추가되는 금액이 적어지니까 사람들이 돈을 더 많이 빌려서 물건도 많이 사게 돼요.',
      '은행에 돈을 맡길 때도 금리가 중요해요! 내가 은행에 1000원을 맡기면, 은행이 나한테 이자를 줘요. 금리가 높을수록 이자를 더 많이 받을 수 있어요.',
    ],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: [
      '금리 높으면 → 돈 빌리기 부담 ↑',
      '금리 낮으면 → 돈 빌리기 쉬워짐',
      '저금할 땐 금리 높을수록 유리!',
    ],
    quiz: {
      question: '금리가 높아지면 어떻게 될까요?',
      options: [
        '돈을 빌리기가 더 쉬워요',
        '돈을 빌리는 비용이 더 비싸져요',
        '은행이 이자를 안 줘요',
        '물건 값이 낮아져요',
      ],
      correctIndex: 1,
      explanation:
        '금리가 높아지면 돈을 빌릴 때 갚아야 하는 이자가 늘어나서, 돈 빌리는 게 더 비싸져요.',
    },
  },
  // 임시 데이터 // api 연동
  AIDC: {
    title: 'AIDC란?',
    intro: 'AIDC에 대한 임시 설명이에요.',
    paragraphs: ['AIDC에 대한 상세 설명은 아직 준비 중이에요. 임시 설명 내용입니다.'],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: ['임시 요약 포인트예요.'],
    quiz: {
      question: 'AIDC에 대한 임시 퀴즈 질문이에요.',
      options: ['임시 옵션 1', '임시 옵션 2', '임시 옵션 3', '임시 옵션 4'],
      correctIndex: 0,
      explanation: '임시 해설이에요.',
    },
  },
  // 임시 데이터 // api 연동
  딥페이크: {
    title: '딥페이크란?',
    intro: '딥페이크에 대한 임시 설명이에요.',
    paragraphs: ['딥페이크에 대한 상세 설명은 아직 준비 중이에요. 임시 설명 내용입니다.'],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: ['임시 요약 포인트예요.'],
    quiz: {
      question: '딥페이크에 대한 임시 퀴즈 질문이에요.',
      options: ['임시 옵션 1', '임시 옵션 2', '임시 옵션 3', '임시 옵션 4'],
      correctIndex: 0,
      explanation: '임시 해설이에요.',
    },
  },
  // 임시 데이터 // api 연동
  종전: {
    title: '종전이란?',
    intro: '종전에 대한 임시 설명이에요.',
    paragraphs: ['종전에 대한 상세 설명은 아직 준비 중이에요. 임시 설명 내용입니다.'],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: ['임시 요약 포인트예요.'],
    quiz: {
      question: '종전에 대한 임시 퀴즈 질문이에요.',
      options: ['임시 옵션 1', '임시 옵션 2', '임시 옵션 3', '임시 옵션 4'],
      correctIndex: 0,
      explanation: '임시 해설이에요.',
    },
  },
  // 임시 데이터 // api 연동
  외화: {
    title: '외화란?',
    intro: '외화에 대한 임시 설명이에요.',
    paragraphs: ['외화에 대한 상세 설명은 아직 준비 중이에요. 임시 설명 내용입니다.'],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: ['임시 요약 포인트예요.'],
    quiz: {
      question: '외화에 대한 임시 퀴즈 질문이에요.',
      options: ['임시 옵션 1', '임시 옵션 2', '임시 옵션 3', '임시 옵션 4'],
      correctIndex: 0,
      explanation: '임시 해설이에요.',
    },
  },
  // 임시 데이터 // api 연동
  투표권: {
    title: '투표권이란?',
    intro: '투표권에 대한 임시 설명이에요.',
    paragraphs: ['투표권에 대한 상세 설명은 아직 준비 중이에요. 임시 설명 내용입니다.'],
    summaryTitle: '이것만 기억해요!',
    summaryPoints: ['임시 요약 포인트예요.'],
    quiz: {
      question: '투표권에 대한 임시 퀴즈 질문이에요.',
      options: ['임시 옵션 1', '임시 옵션 2', '임시 옵션 3', '임시 옵션 4'],
      correctIndex: 0,
      explanation: '임시 해설이에요.',
    },
  },
};

const KeywordQuizScreen = () => {
  const router = useRouter();
  const selectedSkinId = useSkinStore((state) => state.selectedSkinId);
  const mascot = getSkinById(selectedSkinId).image;
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

  const [step, setStep] = useState<'explanation' | 'quiz'>('explanation');

  const answered = selectedIndex !== null;
  const isCorrect = selectedIndex === content.quiz.correctIndex;

  const goToQuiz = () => setStep('quiz');
  const goToExplanation = () => setStep('explanation');

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

  if (step === 'explanation') {
    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <View style={styles.mascotRow}>
          <Image source={mascot} style={styles.mascotImage} resizeMode="contain" />
          <View style={styles.titleBubble}>
            <View style={styles.highlightKeyword}>
              <Text style={styles.titleBubbleKeyword}>{activeKeyword}</Text>
            </View>
            <Text style={styles.titleBubbleText}>{titleRest}</Text>
          </View>
        </View>

        <View style={styles.explanationCard}>
          <Text style={styles.introText}>{content.intro}</Text>
          {content.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraphText}>
              {paragraph}
            </Text>
          ))}

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>{content.summaryTitle}</Text>
          </View>
          {content.summaryPoints.map((point) => (
              <Text key={point} style={styles.summaryPoint}>
                • {point}
              </Text>
            ))}
        </View>

        <View style={styles.spacer} />
        <View style={styles.quizButtonWrap}>
          <Button label="퀴즈 풀기" variant="filled" onPress={goToQuiz} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>키워드 퀴즈</Text>
      <Text style={styles.caption}>기회는 1번 뿐이니 신중하게 선택하세요!</Text>
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

      <View style={styles.spacer} />
      {answered && (
        <View style={styles.buttonGroup}>
          <Button label="키워드 다시보기" variant="outlined" onPress={goToExplanation} />
          <Button label="뉴스 보기" variant="filled" onPress={() => router.push('/news')} />
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
