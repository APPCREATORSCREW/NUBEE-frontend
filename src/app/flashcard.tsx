import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { useSkinStore, getSkinById } from "../store/useSkinStore";
import { getWordList, deleteWord } from "../apis/wordApi";

// 아이콘
import ArrowCircleLeft from "../components/icons/ArrowCircleLeft";
import SentimentSatisfied from "../components/icons/SentimentSatisfied";
import SentimentStressed from "../components/icons/SentimentStressed";
import Button from "../components/common/Button";

interface WordItem {
  userKeywordId: number;
  keywordId: number;
  word: string;
  explanation: string;
  exampleSentence: string;
}

export default function FlashCard() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalWords, setTotalWords] = useState(0);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(1); // 몇 번째 카드를 풀고 있는지 나타내는 카운터 (1부터 시작)
  const [isFront, setIsFront] = useState(true);
  const [finished, setFinished] = useState(false);
  
  const selectedSkinId = useSkinStore((s) => s.selectedSkinId);
  const skin = getSkinById(selectedSkinId);

  // 애니메이션 값 (0: 앞면, 180: 뒷면)
  const flipAnim = useRef(new Animated.Value(0)).current;

  // 서버에서 단어장 목록 API 호출
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setIsLoading(true);
        const data = await getWordList();
        if (data.isSuccess) {
          const mergedWords = [
            ...(data.result.todayWords ?? []),
            ...(data.result.previousWords ?? []),
          ];
          setWords(mergedWords);
          setTotalWords(mergedWords.length);
        }
      } catch (error: any) {
        Alert.alert("오류", error.message || "단어 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWords();
  }, []);

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFront ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFront(!isFront);
  };

  // 3D 회전 애니메이션 보간
  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  // 애니메이션 투명도 조절
  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0],
  });
  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1],
  });

  const current = useMemo(() => words[index], [words, index]);
  // 진행바 채워지는 비율은 step과 totalWords를 기준
  const progress = totalWords > 0 ? (step / totalWords) * 100 : 0;

  const handleKnowWord = async () => {
    if (!current) return;

    try {
      const data = await deleteWord(current.userKeywordId);

      if (data.isSuccess) {
        const updatedWords = words.filter(
          (word) => word.userKeywordId !== current.userKeywordId
        );

        setWords(updatedWords);

        // 진행 단계(step)를 1 증가시키고, 전체 개수를 넘어서면 완료 처리
        if (step >= totalWords || updatedWords.length === 0) {
          setFinished(true);
          return;
        }

        setStep((prev) => prev + 1);

        setIndex((prev) => {
          if (prev >= updatedWords.length) {
            return updatedWords.length - 1;
          }
          return prev;
        });

        flipAnim.setValue(0);
        setIsFront(true);
      }
    } catch (error: any) {
      Alert.alert("오류", error.message);
    }
  };

  const handleNext = () => {
    if (step >= totalWords || index === words.length - 1) {
      setFinished(true);
      return;
    }
    setStep((prev) => prev + 1);
    flipAnim.setValue(0);
    setIsFront(true);
    setIndex((prev) => (prev + 1 < words.length ? prev + 1 : 0));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.black} />
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}><ArrowCircleLeft /></Pressable>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressBackground}>
              <View style={[styles.progressFill, { width: "100%" }]} />
            </View>
            <Text style={styles.progressText}>
              {totalWords}/{totalWords}
            </Text>
          </View>
          <View style={styles.finishCard}>
            <View style={{ height: 40 }} />
            <Image source={skin.image} style={styles.finishImage} />
            <Text style={styles.finishTitle}>축하합니다{"\n"}학습이 끝났어요!</Text>
          </View>
          <View style={{ paddingHorizontal: 0, marginTop: 20 }}>
            <Button label="홈으로" variant="outlined" onPress={() => router.replace("/(tabs)/home")} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (words.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()}><ArrowCircleLeft /></Pressable>
          </View>
          <View style={styles.finishCard}>
            <Text style={styles.finishTitle}>학습할 단어가 없어요!{"\n"}단어장에 단어를 추가해 주세요.</Text>
          </View>
          <View style={{ paddingHorizontal: 0, marginTop: 20 }}>
            <Button label="단어장으로 돌아가기" variant="outlined" onPress={() => router.back()} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><ArrowCircleLeft /></Pressable>
        </View>

        {/* 프로그레스바 영역 */}
        <View style={styles.progressRow}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          {/* 어떤 버튼을 누르든 카드를 넘길 때마다 step이 1씩 증가하여 n/totalWords 형태로 표시 */}
          <Text style={styles.progressText}>{step}/{totalWords}</Text>
        </View>

        {/* 카드 영역 */}
        <Pressable onPress={flipCard} style={styles.cardContainer}>
          {/* 앞면 카드 */}
          <Animated.View 
            style={[
              styles.card, 
              isFront ? styles.relativeCard : styles.absoluteCard,
              { 
                transform: [{ rotateY: frontRotate }],
                opacity: frontOpacity,
              }
            ]}
          >
            <Text style={styles.word}>{current?.word}</Text>
          </Animated.View>

          {/* 뒷면 카드 */}
          <Animated.View 
            style={[
              styles.card, 
              styles.backCard,
              !isFront ? styles.relativeCard : styles.absoluteCard,
              { 
                transform: [{ rotateY: backRotate }],
                opacity: backOpacity,
              }
            ]}
          >
            <Text style={styles.description}>{current?.explanation}</Text>
          </Animated.View>
        </Pressable>

        {/* 인디케이터 */}
        <View style={styles.indicatorRow}>
          {words.map((_, item) => (
            <View key={item} style={[item === index ? styles.activeIndicator : styles.indicator]} />
          ))}
        </View>

        {/* 하단 액션 버튼들 */}
        <View style={styles.buttonRow}>
          <Pressable style={[styles.actionButton, styles.againButton]} onPress={handleNext}>
            <SentimentStressed />
            <Text style={styles.actionText}>다시 볼래요!</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.knowButton]} onPress={handleKnowWord}>
            <SentimentSatisfied />
            <Text style={styles.actionText}>알아요!</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7D66E" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 60 },
  center: { justifyContent: "center", alignItems: "center" },
  header: { paddingLeft: 0, paddingTop: 10, height: 48, justifyContent: "center" },
  
  progressRow: { marginTop: 16, width: "100%", alignSelf: "center" },
  progressBackground: { height: 10, borderRadius: 20, backgroundColor: "rgba(255,252,247,0.25)", overflow: "hidden" },
  progressFill: { height: 10, borderRadius: 20, backgroundColor: "#FFFCF7" },
  progressText: { alignSelf: "flex-end", marginTop: 8, fontFamily: fonts.family.bold, fontSize: 15, color: colors.black },
  
  cardContainer: { width: "100%", alignSelf: "center", marginTop: 24 },
  
  card: {
    backgroundColor: "#FFFCF7",
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 280,
    width: "100%",
    backfaceVisibility: "hidden",
    elevation: 6,
  },
  relativeCard: {
    position: "relative",
  },
  absoluteCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  backCard: { 
    backgroundColor: "rgba(255,252,247,0.95)"
  },
  
  word: { fontFamily: fonts.family.bold, fontSize: 38, color: colors.black, textAlign: "center" },
  description: { fontFamily: fonts.family.regular, fontSize: 20, color: colors.black, textAlign: "center", lineHeight: 28 },
  
  indicatorRow: { flexDirection: "row", justifyContent: "center", marginTop: 28, marginBottom: 24 },
  indicator: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 6, backgroundColor: "rgba(255,252,247,0.35)" },
  activeIndicator: { width: 42, height: 12, borderRadius: 20, marginHorizontal: 6, backgroundColor: "#FFFCF7" },
  
  buttonRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", alignSelf: "center" },
  actionButton: { width: "47%", height: 100, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 6 },
  againButton: { backgroundColor: "#FFEAF6" },
  knowButton: { backgroundColor: "#EAF1D2" },
  actionText: { marginTop: 2, fontFamily: fonts.family.bold, fontSize: 18, color: colors.black },
  
  finishCard: { marginTop: 30, marginBottom: 30, borderRadius: 30, backgroundColor: "#FFFCF7", justifyContent: "center", alignItems: "center", paddingHorizontal: 30, height: 360, width: "100%", alignSelf: "center" },
  finishImage: { width: 150, height: 150, transform: [{ translateY: -30 }] },
  finishTitle: { textAlign: "center", fontFamily: fonts.family.bold, fontSize: 26, color: colors.black, transform: [{ translateY: -20 }], lineHeight: 36 },
});