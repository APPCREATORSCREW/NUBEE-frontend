import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Button from "../components/common/Button";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";
import { getNewsDetail } from "../apis/newsApi";
import { addWordToBook } from "../apis/wordApi";

interface KeywordItem {
  id: number;
  word: string;
  keyword_type: string;
  explanation: string;
}

interface NewsData {
  id: number;
  category: string;
  title: string;
  summary: string;
  image_url: string;
  original_url: string;
  published_at: string;
  publisher: string;
  related_keywords: KeywordItem[];
}

export default function News() {
  const { newsId, fromReview } = useLocalSearchParams<{
    newsId?: string;
    fromReview?: string;
  }>();
  const activeNewsId = Number(newsId);

  const [news, setNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWord, setSelectedWord] = useState<KeywordItem | null>(null);

  useEffect(() => {
    fetchNewsDetail();
  }, [activeNewsId]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const data = await getNewsDetail(activeNewsId);

      if (data.isSuccess) {
        setNews(data.result);
      }
    } catch (error: any) {
      Alert.alert("오류", error.message);
    } finally {
      setLoading(false);
    }
  };

  // MAIN 키워드일 경우 \n\n 기준 첫 단락만 반환하는 파싱 함수
  const getParsedExplanation = (keyword: KeywordItem | null) => {
    if (!keyword || !keyword.explanation) return "";

    if (keyword.keyword_type === "MAIN") {
      const sections = keyword.explanation
        .split(/\r?\n\r?\n/)
        .map((section) => section.trim())
        .filter(Boolean);

      return sections[0] || keyword.explanation;
    }

    return keyword.explanation;
  };

  const handleKeywordPress = (wordText: string) => {
    if (!news) return;
    const found = news.related_keywords.find((k) => k.word === wordText);
    if (found) {
      setSelectedWord(found);
      setModalVisible(true);
    }
  };

  const renderSummary = () => {
    if (!news) return null;
    const lines = news.summary.split("\n");
    const parts: React.ReactNode[] = [];

    // 키워드를 긴 순서대로 정렬 (겹치는 단어 방지)
    const keywords = [...news.related_keywords].sort(
      (a, b) => b.word.length - a.word.length,
    );

    lines.forEach((line, lineIndex) => {
      const isSubtitle = /^[^\w\s가-힣]/u.test(line.trim());
      let currentIndex = 0;
      const lineParts: React.ReactNode[] = [];

      while (currentIndex < line.length) {
        let matchedKeyword: KeywordItem | undefined = undefined;
        let matchedIndex = Infinity;

        for (const keyword of keywords) {
          const idx = line.indexOf(keyword.word, currentIndex);
          if (idx !== -1 && idx < matchedIndex) {
            matchedIndex = idx;
            matchedKeyword = keyword;
          }
        }

        if (!matchedKeyword) {
          if (currentIndex < line.length) {
            lineParts.push(
              <Text key={`text-${lineIndex}-${currentIndex}`}>
                {line.slice(currentIndex)}
              </Text>,
            );
          }
          break;
        }

        if (matchedIndex > currentIndex) {
          lineParts.push(
            <Text key={`text-${lineIndex}-${currentIndex}`}>
              {line.slice(currentIndex, matchedIndex)}
            </Text>,
          );
        }

        lineParts.push(
          <Text
            key={`${matchedKeyword.id}-${lineIndex}-${matchedIndex}`}
            style={[styles.highlight, isSubtitle && styles.subtitle]}
            onPress={() => {
              setSelectedWord(matchedKeyword!);
              setModalVisible(true);
            }}
          >
            {matchedKeyword.word}
          </Text>,
        );
        currentIndex = matchedIndex + matchedKeyword.word.length;
      }

      if (lineParts.length === 0 && line.length > 0) {
        lineParts.push(<Text key={`line-${lineIndex}`}>{line}</Text>);
      }

      parts.push(
        <Text
          key={`line-${lineIndex}`}
          style={isSubtitle ? styles.subtitle : undefined}
        >
          {lineParts}
        </Text>,
      );

      if (lineIndex < lines.length - 1) {
        parts.push("\n");
      }
    });
    return <Text style={styles.body}>{parts}</Text>;
  };

  const handleSaveWord = async () => {
    if (!selectedWord) return;
    try {
      const data = await addWordToBook(selectedWord.id);
      if (data.isSuccess) {
        setModalVisible(false);
      }
    } catch (error: any) {
      Alert.alert("알림", error.message);
    }
  };

  if (loading || !news) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.black} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Image source={{ uri: news.image_url }} style={styles.image} />

        <Text style={styles.title}>{news.title}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.info}>
            {news.publisher}
            {"  "}
            {news.published_at.slice(0, 10).replace(/-/g, ".")}
          </Text>
        </View>

        <View style={styles.section}>{renderSummary()}</View>

        {/* 원문 링크 */}
        {news.original_url && (
          <Pressable
            style={styles.linkButton}
            onPress={async () => {
              try {
                const url = news.original_url.replace("http://", "https://");
                await Linking.openURL(url);
              } catch (e) {
                Alert.alert("오류", "링크를 열 수 없습니다.");
              }
            }}
          >
            <Ionicons name="link-outline" size={20} color={colors.black} />
            <Text style={styles.linkText}>원문 보러 가기</Text>
          </Pressable>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* 키워드 팝업 모달 */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <View style={styles.modalDot} />
            <Text style={styles.modalTitle}>{selectedWord?.word}</Text>

            {/* 파싱된 설명 출력 */}
            <Text style={styles.modalDescription}>
              {getParsedExplanation(selectedWord)}
            </Text>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>닫기</Text>
              </Pressable>

              <Pressable style={styles.saveButton} onPress={handleSaveWord}>
                <Text style={styles.saveButtonText}>단어장에 추가</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {fromReview !== "true" && (
        <View style={styles.buttonContainer}>
          <Button
            label="퀴즈 풀기"
            variant="filled"
            onPress={() =>
              router.push({
                pathname: "/news-quiz",
                params: { newsId: activeNewsId },
              })
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { justifyContent: "center", alignItems: "center" },
  content: { paddingBottom: 20 },
  image: { width: "100%", height: 220, resizeMode: "cover" },
  title: {
    paddingHorizontal: 20,
    marginTop: 24,
    fontFamily: fonts.family.bold,
    fontSize: 26,
    color: colors.black,
    lineHeight: 36,
  },
  infoContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  info: { fontFamily: fonts.family.regular, fontSize: 13, color: colors.black },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  body: {
    fontFamily: fonts.family.regular,
    fontSize: 18,
    letterSpacing: 18 * 0.02,
    color: colors.black,
    lineHeight: 31,
  },
  linkButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 6,
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  linkText: {
    marginLeft: 6,
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "84%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    elevation: 8,
  },
  modalDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#F7D66E",
    marginBottom: 16,
  },
  modalTitle: {
    textAlign: "center",
    fontFamily: fonts.family.bold,
    fontSize: 26,
    color: colors.black,
    marginBottom: 16,
  },
  modalDescription: {
    textAlign: "center",
    fontFamily: fonts.family.regular,
    fontSize: 15,
    lineHeight: 24,
    color: colors.black,
  },
  modalButtonRow: { flexDirection: "row", marginTop: 24 },
  closeButton: {
    flex: 1,
    backgroundColor: colors.yellow100,
    borderWidth: 1,
    borderColor: colors.yellow400,
    borderRadius: 16,
    paddingVertical: 14,
    marginRight: 8,
  },
  closeButtonText: {
    textAlign: "center",
    color: colors.black,
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.yellow400,
    borderRadius: 16,
    paddingVertical: 14,
    marginLeft: 8,
  },
  saveButtonText: {
    textAlign: "center",
    color: colors.black,
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
  },
  highlight: {
    fontFamily: fonts.family.bold,
    backgroundColor: colors.yellow400,
    color: colors.black,
  },
  subtitle: {
    fontFamily: fonts.family.bold,
  },
});
