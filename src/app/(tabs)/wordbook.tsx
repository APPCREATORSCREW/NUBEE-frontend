import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Button from "../../components/common/Button";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { getWordList } from "../../apis/wordApi";

interface WordItem {
  userKeywordId: number;
  keywordId: number;
  word: string;
  explanation: string;
  exampleSentence: string;
  keywordType?: string;
  keyword_type?: string;
}

export default function Wordbook() {
  const [todayWords, setTodayWords] = useState<WordItem[]>([]);
  const [previousWords, setPreviousWords] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWords = async () => {
    try {
      setIsLoading(true);
      const data = await getWordList();
      if (data.isSuccess) {
        setTodayWords(data.result.todayWords);
        setPreviousWords(data.result.previousWords);
      }
    } catch (error: any) {
      Alert.alert("오류", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  // MAIN 키워드 여부 확인
  const isMainKeyword = (item: WordItem) => {
    return item.keywordType === "MAIN" || item.keyword_type === "MAIN";
  };

  // MAIN 키워드일 경우 \n\n 기준 첫 단락만 자르기
  const getDisplayExplanation = (item: WordItem) => {
    if (!item.explanation) return "";

    if (isMainKeyword(item)) {
      const sections = item.explanation.split(/\r?\n\r?\n/).map((s) => s.trim()).filter(Boolean);
      return sections[0] || item.explanation;
    }

    return item.explanation;
  };

  const renderCard = (item: WordItem) => {
    const isMain = isMainKeyword(item);

    return (
      <View key={item.userKeywordId} style={styles.card}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={[styles.description, isMain ? styles.textLeft : styles.textCenter]}>
          {getDisplayExplanation(item)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>단어장</Text>

        <Text style={styles.sectionTitle}>오늘 저장</Text>

        {todayWords.length === 0 && !isLoading ? (
          <Text style={styles.emptyText}>오늘 저장된 단어가 없어요.</Text>
        ) : (
          todayWords.map(renderCard)
        )}

        <Text style={styles.sectionTitle}>이전에 저장</Text>

        {previousWords.length === 0 && !isLoading ? (
          <Text style={styles.emptyText}>이전에 저장된 단어가 없어요.</Text>
        ) : (
          previousWords.map(renderCard)
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.floatingButton}>
        <Button
          label="플래시카드로 학습하기"
          variant="filled"
          onPress={() => router.push("/flashcard")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    paddingTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.gray400,
    marginBottom: 16,
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.gray100,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
    marginBottom: 18,
    backgroundColor: colors.background,
  },
  word: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    lineHeight: 28,
  },
  textLeft: {
    textAlign: "left",
  },
  textCenter: {
    textAlign: "center",
  },
  emptyText: {
    fontFamily: fonts.family.regular,
    fontSize: 16,
    color: colors.gray400,
    textAlign: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  floatingButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 16,
    backgroundColor: "transparent",
  },
});