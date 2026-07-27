import { Image, Pressable, ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import { PolygonBlue, PolygonGreen, PolygonPink, PolygonYellow } from '../../components/icons';
import Button from '../../components/common/Button';
import { useUserStore } from '../../store/useUserStore';
import { useSkinStore, getSkinById } from '../../store/useSkinStore';
import { useEffect, useState } from 'react';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { KeywordsAPI, NewsItem } from '../../apis/home';
import { getErrorMessage } from '../../utils/getErrorMessage';

const HEXAGON_COLORS = [PolygonYellow, PolygonGreen, PolygonBlue, PolygonPink];

const HEX_WIDTH = 180;
const HEX_HEIGHT = 180;

const COLUMN_OVERLAP = HEX_WIDTH * 0.21;
const ROW_OFFSET = HEX_HEIGHT / 2.21;

const ROW_GAP = (-HEX_HEIGHT) / 10.5;

const HomeScreen = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const settings = useUserStore((state) => state.settings);
  const visitedKeywords = useUserStore((state) => state.visitedKeywords);
  const markKeywordVisited = useUserStore((state) => state.markKeywordVisited);
  const quizAnswers = useUserStore((state) => state.quizAnswers);
  const selectedSkinId = useSkinStore((state) => state.selectedSkinId);
  const mascot = getSkinById(selectedSkinId).image;

  const [isLoading, setIsLoading] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  // 프로필 조회 api 연동 후
  const level = user?.level ?? 1;
  const points = user?.points ?? 0;
  const streakDays = user?.streak ?? 0;
  const pointsToNextLevel = 35;

  useEffect(() => {

    const fetchKeywords = async () => {
      setIsLoading(true);
      try {
        const response = await KeywordsAPI();
        if (response.isSuccess) {
          setNewsList(response.result.news_list);
        }
      } catch (error) {
        Alert.alert('Error', getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    };
    fetchKeywords();
  }, []);

  const handlePressKeyword = (keyword_id: number, news_id: number) => {
    if (quizAnswers[keyword_id] !== undefined) return;
    markKeywordVisited(keyword_id);
    router.push({ pathname: '/keyword-quiz', params: { keyword_id, news_id } });
  };

  const leftColumn = newsList.filter((_, index) => index % 2 === 0);
  const rightColumn = newsList.filter((_, index) => index % 2 === 1);

  const renderColumn = (items: NewsItem[], startIndex: number) => (
    <View style={startIndex === 1 ? styles.columnOffset : styles.column}>
      {items.map((item, i) => {
        const originalIndex = startIndex + i * 2;
        const Polygon = HEXAGON_COLORS[originalIndex % HEXAGON_COLORS.length];
        const isAnswered = quizAnswers[item.main_keyword.id] !== undefined;
        return (
          <Pressable
            key={item.main_keyword.id}
            style={[styles.hexagon, isAnswered && styles.hexagonVisited]}
            onPress={() => handlePressKeyword(item.main_keyword.id, item.id)}
            disabled={isAnswered}
          >
            <Polygon width={HEX_WIDTH} height={HEX_HEIGHT} />
            <Text style={styles.hexagonLabel}>{item.main_keyword.word}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={styles.flex}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
        <View style={styles.topRow}>
          <View style={[styles.badge, styles.levelBadge]}>
            <Text style={styles.badgeText}>🐝 Lv.{level}</Text>
          </View>
          <View style={[styles.badge, styles.pointBadge]}>
            <Text style={styles.badgeText}>🍀 {points}P</Text>
          </View>
        </View>

        <View style={styles.mascotRow}>
          <Image source={mascot} style={styles.mascot} resizeMode="contain" />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>오늘의 키워드!</Text>
          </View>
        </View>

        <View style={styles.streakBox}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakLabel}>연속 학습</Text>
            <Text style={styles.streakTitle}>{streakDays}일째 공부 중</Text>
            <Text style={styles.streakSub}>
              Level {level + 1}까지 딱 {pointsToNextLevel}포인트 남았어요
            </Text>
          </View>
        </View>

        <View style={styles.hexGrid}>
          {renderColumn(leftColumn, 0)}
          {renderColumn(rightColumn, 1)}
        </View>
      </ScrollView>

      {visitedKeywords.length > 0 && (
        <View style={styles.floatingButton}>
          <Button
            label="오늘의 학습을 부모님께 자랑해요"
            variant="filled"
            onPress={() => {
              // api 연동
            }}
          />
        </View>
      )}

      {isLoading && <LoadingIndicator />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  levelBadge: {
    backgroundColor: colors.yellow100,
  },
  pointBadge: {
    backgroundColor: colors.green100,
  },
  badgeText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
    marginLeft: 20
  },
  mascot: {
    width: 135,
    height: 135,
  },
  speechBubble: {
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingVertical: 13,
    marginBottom: 20,
  },
  speechText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  streakBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  streakEmoji: {
    fontSize: 40,
    marginRight: 10,
  },
  streakLabel: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
    marginBottom: -4,
  },
  streakTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  streakSub: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
    marginTop: 2,
  },
  hexGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  column: {},
  columnOffset: {
    marginTop: ROW_OFFSET,
    marginLeft: -COLUMN_OVERLAP,
  },
  hexagon: {
    width: HEX_WIDTH,
    height: HEX_HEIGHT,
    marginBottom: ROW_GAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexagonVisited: {
    opacity: 0.35,
  },
  hexagonLabel: {
    position: 'absolute',
    fontFamily: fonts.family.bold,
    // header 사이즈보다 커서 임시 조절
    fontSize: 27,
    letterSpacing: 27 * -0.02,
    color: colors.black,
  },
  floatingButton: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 16,
  },
});