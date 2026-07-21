import React, { useMemo, useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Image,
} from "react-native";
import { router } from "expo-router";

import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";

// 팀원이 구현한 캐릭터 스킨 스토어 및 유틸 경로 (프로젝트 구조에 맞게 경로 확인 필요)
import { useSkinStore, getSkinById } from "../store/useSkinStore";

// 아이콘
import ArrowCircleLeft from "../components/icons/ArrowCircleLeft";
import SentimentSatisfied from "../components/icons/SentimentSatisfied";
import SentimentStressed from "../components/icons/SentimentStressed";
import Button from "../components/common/Button";

const words = [
  { id: 1, word: "반도체", description: "상황에 따라 전기를 잘 흐르게도 하고 막기도 할 수 있는 특별한 재료예요. 전기를 켰다 껐다 할 수 있기 때문에 스마트폰이나 컴퓨터의 재료가 되고 그 안에서 중요한 역할을 해요." },
  { id: 2, word: "금리", description: "돈을 빌릴 때 내는 사용료의 비율이에요. 금리가 높으면 대출 이자가 비싸지고, 낮으면 저렴해져요." },
  { id: 3, word: "기준 금리", description: "한국은행이 정하는 기본 금리예요. 여러 금융기관의 금리에 영향을 줍니다." },
  { id: 4, word: "물가", description: "물건과 서비스의 전체적인 가격 수준을 의미해요." },
];

export default function FlashCard() {
  const [index, setIndex] = useState(0);
  const [isFront, setIsFront] = useState(true);
  const [finished, setFinished] = useState(false);
  
  // 팀원 가이드대로 전역 스토어에서 선택된 스킨 정보 가져오기
  const selectedSkinId = useSkinStore((s) => s.selectedSkinId);
  const skin = getSkinById(selectedSkinId);

  // 애니메이션 값
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    Animated.timing(flipAnim, {
      toValue: isFront ? 180 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFront(!isFront);
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const current = useMemo(() => words[index], [index]);
  const progress = ((index + 1) / words.length) * 100;
  const indicatorIndex = Math.round((index / (words.length - 1)) * 3); // words 개수에 맞춰 수정

  const handleNext = () => {
    if (index === words.length - 1) {
      setFinished(true);
      return;
    }
    // 다음 카드로 넘어갈 때 애니메이션 초기화
    flipAnim.setValue(0);
    setIsFront(true);
    setIndex((prev) => prev + 1);
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}><Pressable onPress={() => router.back()}><ArrowCircleLeft /></Pressable></View>
        <View style={styles.progressRow}>
          <View style={styles.progressBackground}><View style={[styles.progressFill, { width: "100%" }]} /></View>
          <Text style={styles.progressText}>{words.length}/{words.length}</Text>
        </View>
        <View style={styles.finishCard}>
          <View style={{ height: 80 }} />
          {/* 전역 스토어에서 가져온 스킨 이미지 동적 렌더링 */}
          <Image source={skin.image} style={styles.finishImage} />
          <Text style={styles.finishTitle}>축하합니다{"\n"}학습이 끝났어요!</Text>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <Button label="홈으로" variant="outlined" onPress={() => router.replace("/(tabs)/home")} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Pressable onPress={() => router.back()}><ArrowCircleLeft /></Pressable></View>
      <View style={styles.progressRow}>
        <View style={styles.progressBackground}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.progressText}>{index + 1}/{words.length}</Text>
      </View>

      <View style={styles.cardContainer}>
        <Pressable onPress={flipCard} style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.card, { transform: [{ rotateY: frontRotate }] }]}>
            <Text style={styles.word}>{current.word}</Text>
          </Animated.View>
          <Animated.View style={[styles.card, styles.backCard, { transform: [{ rotateY: backRotate }] }]}>
            <Text style={styles.description}>{current.description}</Text>
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.indicatorRow}>
        {[0, 1, 2, 3].map((item) => (
          <View key={item} style={[item === indicatorIndex ? styles.activeIndicator : styles.indicator]} />
        ))}
      </View>

      <View style={styles.buttonRow}>
        <Pressable style={[styles.actionButton, styles.againButton]} onPress={handleNext}><SentimentStressed /><Text style={styles.actionText}>다시 볼래요!</Text></Pressable>
        <Pressable style={[styles.actionButton, styles.knowButton]} onPress={handleNext}><SentimentSatisfied /><Text style={styles.actionText}>알아요!</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7D66E", paddingHorizontal: 20, paddingTop: 12 },
  header: { paddingLeft: 20, paddingTop: 30, height: 48, justifyContent: "center" },
  progressRow: { marginTop: 10, width: "90%", alignSelf: "center", paddingTop: 30 },
  progressBackground: { height: 10, borderRadius: 20, backgroundColor: "rgba(255,252,247,0.25)", overflow: "hidden" },
  progressFill: { height: 10, borderRadius: 20, backgroundColor: "#FFFCF7" },
  progressText: { alignSelf: "flex-end", marginTop: 8, fontFamily: fonts.family.bold, fontSize: 15, color: colors.black },
  cardContainer: { height: 300, width: "90%", alignSelf: "center", marginTop: 26 },
  card: {
    position: 'absolute',
    backgroundColor: "#FFFCF7",
    borderRadius: 28,
    paddingHorizontal: 28,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    width: "100%",
    backfaceVisibility: 'hidden',
    elevation: 6,
  },
  backCard: { backgroundColor: "rgba(255,252,247,0.95)" },
  word: { fontFamily: fonts.family.bold, fontSize: 38, color: colors.black, textAlign: "center" },
  description: { fontFamily: fonts.family.regular, fontSize: 22, color: colors.black, textAlign: "center" },
  indicatorRow: { flexDirection: "row", justifyContent: "center", marginTop: 28, marginBottom: 36 },
  indicator: { width: 12, height: 12, borderRadius: 6, marginHorizontal: 6, backgroundColor: "rgba(255,252,247,0.35)" },
  activeIndicator: { width: 42, height: 12, borderRadius: 20, marginHorizontal: 6, backgroundColor: "#FFFCF7" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "90%", alignSelf: "center" },
  actionButton: { width: "47%", height: 100, borderRadius: 28, justifyContent: "center", alignItems: "center", elevation: 6 },
  againButton: { backgroundColor: "#FFEAF6" },
  knowButton: { backgroundColor: "#EAF1D2" },
  actionText: { marginTop: 2, fontFamily: fonts.family.bold, fontSize: 18, color: colors.black },
  finishCard: { marginTop: 30, marginBottom: 40, borderRadius: 30, backgroundColor: "#FFFCF7", justifyContent: "center", alignItems: "center", paddingHorizontal: 30, height: 400, width: "90%", alignSelf: "center" },
  finishImage: { width: 150, height: 150, transform: [{ translateY: -50 }] },
  finishTitle: { textAlign: "center", fontFamily: fonts.family.bold, fontSize: 30, color: colors.black, transform: [{ translateY: -30 }] },
});