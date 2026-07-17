import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";

import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

const categories = ["경제", "사회", "과학", "세계"];

const reviewData = {
  경제: [
    { month: "2026.05", title: "한국 성장률 전망 '쑥'...\n경기과열 조짐에 고개드는 금리 인상론", date: "2026.05.05" },
  ],
  사회: [
    { month: "2026.05", title: "야구장 연기 치솟자 뛰쳐나왔다...\n경기 관람하던 소방관들의 기지", date: "2026.05.07" },
    { month: "2026.05", title: '"다이어트약 있나요?" SNS 단체\n방 타고 퍼진 불법 의약품', date: "2026.05.07" },
  ],
  과학: [],
  세계: [],
};

export default function ReviewScreen() {
  const [selected, setSelected] = useState("경제");

  const renderNewsCard = (item: any, index: number, array: any[]) => {
    const isFirstOfMonth = index === 0 || array[index - 1].month !== item.month;

    return (
      <View key={index}>
        {isFirstOfMonth && (
          <View style={styles.monthChip}>
            <Text style={styles.monthText}>{item.month}</Text>
          </View>
        )}

        <View style={styles.newsCard}>
          <View style={styles.thumbnail} />
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsDate}>{item.date}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../../assets/skins/skin_origin.png")} 
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyText}>아직 학습한 기사가 없어요</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>복습하기</Text>

      <View style={styles.tabRow}>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={styles.tab}
            onPress={() => setSelected(category)}
          >
            <Text
              style={[
                styles.tabText,
                selected === category && styles.selectedTabText,
              ]}
            >
              {category}
            </Text>
            <View
              style={[
                styles.tabLine,
                selected === category && styles.selectedTabLine,
              ]}
            />
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {reviewData[selected as keyof typeof reviewData].length > 0 ? (
          reviewData[selected as keyof typeof reviewData].map((item, index, array) =>
            renderNewsCard(item, index, array)
          )
        ) : (
          renderEmpty()
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCF7",
    paddingTop: 30,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: 30,
    color: colors.black,
    marginBottom: 30,
    paddingTop: 20,
    paddingLeft: 20,
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontFamily: fonts.family.bold,
    fontSize: 18,
    color: "#B8B8B8",
    marginBottom: 12,
  },
  selectedTabText: {
    color: colors.black,
  },
  tabLine: {
    width: "100%",
    height: 2,
    backgroundColor: "transparent",
  },
  selectedTabLine: {
    backgroundColor: colors.black,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  monthChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#A8A8A8",
    marginBottom: 18,
    marginTop: 5,
  },
  monthText: {
    fontFamily: fonts.family.regular,
    fontSize: 14,
    color: "#8C8C8C",
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: "#FFF7DE",
    borderRadius: 22,
    padding: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#D9D9D9",
    marginRight: 16,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontFamily: fonts.family.bold,
    fontSize: 18,
    color: colors.black,
    lineHeight: 28,
  },
  newsDate: {
    marginTop: 12, // 제목과 날짜 사이 간격
    alignSelf: "flex-end",
    fontFamily: fonts.family.regular,
    fontSize: 13,
    color: colors.black,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: fonts.family.bold,
    fontSize: 20,
    color: colors.black, // 검정색으로 변경
  },
});