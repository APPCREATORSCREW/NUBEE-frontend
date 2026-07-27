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
  learned: boolean;
}

export default function Wordbook() {
  const [words, setWords] = useState<WordItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchWords = async () => {
    try {
      setIsLoading(true);
      const data = await getWordList();
      if (data.isSuccess) {
        setWords(data.result);
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

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>단어장</Text>

        <Text style={styles.sectionTitle}>저장된 단어 목록</Text>

        {words.length === 0 && !isLoading ? (
          <Text style={styles.emptyText}>단어장에 저장된 단어가 없어요.</Text>
        ) : (
          words.map((item) => (
            <View key={item.userKeywordId} style={styles.card}>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.description}>{item.explanation}</Text>
            </View>
          ))
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
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 80,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: 30,
    color: colors.black,
    paddingTop: 45,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: fonts.family.regular,
    fontSize: 20,
    color: colors.gray400,
    marginBottom: 16,
    marginTop: 10,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.gray100,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginBottom: 18,
    backgroundColor: colors.background,
  },
  word: {
    fontFamily: fonts.family.bold,
    fontSize: 22,
    color: colors.black,
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.family.regular,
    fontSize: 18,
    color: colors.black,
    lineHeight: 28,
  },
  emptyText: {
    fontFamily: fonts.family.regular,
    fontSize: 16,
    color: colors.gray400,
    textAlign: "center",
    marginTop: 40,
  },
  floatingButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 16,
    backgroundColor: "transparent",
  },
});