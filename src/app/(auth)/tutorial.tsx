import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { useTutorialStore } from '../../store/useTutorialStore';

const mascot = require('../../../assets/skins/skin_origin.png');
const tutorial1 = require('../../../assets/icons/tutorial1.png');
const tutorial2 = require('../../../assets/icons/tutorial2.png');
const tutorial3 = require('../../../assets/icons/tutorial3.png');
const tutorial4 = require('../../../assets/icons/tutorial4.png');
const tutorial5 = require('../../../assets/icons/tutorial5.png');
const tutorial6 = require('../../../assets/icons/tutorial6.png');

const SCREEN_WIDTH = Dimensions.get('window').width;
// Tutorial 이미지 원본 비율(393:631) 유지하며 화면 가로폭에 맞춤
const ILLUSTRATION_WIDTH = SCREEN_WIDTH;
const ILLUSTRATION_HEIGHT = ILLUSTRATION_WIDTH * (631 / 393);

const START_BUTTON_DELAY_MS = 300;

// 임시 // api 연동
const PAGES = [
  {
    type: 'welcome' as const,
    title1: '누비',
    title: '와 함께 할\n준비가 되셨나요?',
    subtitle: '누비로 이렇게 공부해요!',
  },
  {
    type: 'content' as const,
    title: '메인 홈 화면',
    subtitle: '오늘의 키워드와 뉴스를 학습해보세요!\n매일 새로운 키워드가 기다리고 있어요',
    image: tutorial1,
  },
  {
    type: 'content' as const,
    title: '키워드 학습',
    subtitle: '뉴스를 이해하는 데 도움이 될\n키워드를 먼저 공부해요',
    image: tutorial2,
  },
  {
    type: 'content' as const,
    title: '뉴스 학습',
    subtitle: '쉽게 읽는 뉴스로 세상을 공부해요\n모르는 단어는 바로 단어장에 저장해요',
    image: tutorial3,
  },
  {
    type: 'content' as const,
    title: '단어장',
    subtitle: '내가 저장한 단어들을 한눈에 확인하고\n플래시카드로 학습해요',
    image: tutorial4,
  },
  {
    type: 'content' as const,
    title: '복습하기',
    subtitle: '내가 학습한 뉴스를 다시 볼 수 있어요\n',
    image: tutorial5,
  },
  {
    type: 'content' as const,
    title: '다양한 캐릭터 스킨',
    subtitle: '퀴즈를 맞히고 포인트를 모아\n다양한 캐릭터 스킨을 얻어보세요',
    image: tutorial6,
  },
];

const TutorialScreen = () => {
  const router = useRouter();
  const currentPage = useTutorialStore((state) => state.currentPage);
  const setCurrentPage = useTutorialStore((state) => state.setCurrentPage);
  const scrollRef = useRef<ScrollView>(null);
  const [showStartButton, setShowStartButton] = useState(false);
  const startButtonAnim = useRef(new Animated.Value(0)).current;

  const isLastPage = currentPage === PAGES.length - 1;
  const page = PAGES[currentPage];

  useEffect(() => {
    if (!isLastPage) {
      setShowStartButton(false);
      return;
    }
    const timer = setTimeout(() => setShowStartButton(true), START_BUTTON_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isLastPage]);

  useEffect(() => {
    if (!showStartButton) {
      startButtonAnim.setValue(0);
      return;
    }
    Animated.timing(startButtonAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showStartButton, startButtonAnim]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(index);
  };

  const goToNextPage = () => {
    const nextIndex = Math.min(currentPage + 1, PAGES.length - 1);
    if (nextIndex === currentPage) return;
    scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
    setCurrentPage(nextIndex);
  };

  const goToSelectKeyword = () => {
    router.replace('/select-keyword');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.skipButton} onPress={goToSelectKeyword}>
        <Text style={styles.skipText}>건너뛰기</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.scrollView}
      >
        {PAGES.map((p, index) => (
          <Pressable key={index} style={styles.slide} onPress={goToNextPage}>
            {p.type === 'welcome' ? (
              <View style={styles.welcomeTextBlock}>
                <Image source={mascot} style={styles.mascot} resizeMode="contain" />
                <Text style={styles.welcomeTitle}>
                  <Text style={styles.welcomeTitleHighlight}>{p.title1}</Text>
                  {p.title}
                </Text>
                <Text style={styles.welcomeSubtitle}>{p.subtitle}</Text>
              </View>
            ) : (
              <>
                <View style={styles.contentTextBlock}>
                  <Text style={styles.contentTitle}>{p.title}</Text>
                  <Text style={styles.contentSubtitle}>{p.subtitle}</Text>
                </View>
                <View style={styles.illustrationWrapper}>
                  <Image source={p.image} style={styles.illustration} resizeMode="contain" />
                </View>
              </>
            )}
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {/* 도트 인디케이터 개수 설정 */}
        {PAGES.slice(1).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage - 1 === index && styles.dotActive]}
          />
        ))}
      </View>

      {isLastPage && showStartButton && (
        <Animated.View
          style={[
            styles.overlayGroup,
            {
              opacity: startButtonAnim,
              transform: [
                {
                  translateY: startButtonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents="box-none"
        >
          <LinearGradient
            colors={['rgba(255,252,247,0.3)', 'rgba(255,252,247,0.5)', colors.background]}
            locations={[0, 0.5, 1]}
            style={styles.blurBackdrop}
            pointerEvents="none"
          />
          <View style={styles.startButtonWrapper}>
            <Button label="확인했어요!" variant="filled" onPress={goToSelectKeyword} />
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 70,
    right: 25,
    zIndex: 10,
  },
  skipText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.gray400,
  },
  welcomeTextBlock: {
    alignItems: 'center',
    marginTop: 90,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeTitleHighlight: {
    color: colors.yellow400,
  },
  welcomeSubtitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginTop: 8,
  },
  contentTextBlock: {
    alignItems: 'center',
    marginTop: 110,
    paddingHorizontal: 20,
    gap: 8,
  },
  contentTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginBottom: 8,
  },
  contentSubtitle: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 10,
  },
  illustration: {
    width: ILLUSTRATION_WIDTH,
    height: ILLUSTRATION_HEIGHT,
  },
  mascot: {
    width: 160,
    height: 160,
    marginBottom: 16,
    marginTop: 140,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 45,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 1.5,
    borderColor: colors.yellow400,
    backgroundColor: colors.background,
  },
  dotActive: {
    backgroundColor: colors.yellow400,
  },
  overlayGroup: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  startButtonWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
  },
});
