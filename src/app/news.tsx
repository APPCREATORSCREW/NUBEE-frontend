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
  ActivityIndicator
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
  const { newsId, fromReview } = useLocalSearchParams<{ newsId?: string; fromReview?: string }>();
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
      (a, b) => b.word.length - a.word.length ); 
      lines.forEach((line, lineIndex) => { 
        // 이모티콘으로 시작하는 줄인지 확인 
        // // 예: ⚖️ 법을 지키는 든든한 가이드 
        // // 🏢 로펌으로 가는 노동 전문가들 
        const isSubtitle = /^[^\w\s가-힣]/u.test(line.trim()); 
        let currentIndex = 0; 
        const lineParts: React.ReactNode[] = []; 
        while (currentIndex < line.length) { 
          let matchedKeyword: KeywordItem | undefined = undefined; 
          let matchedIndex = Infinity; 
          // 현재 위치 이후 가장 먼저 나오는 키워드 찾기 
          for (const keyword of keywords) { 
            const idx = line.indexOf(keyword.word, currentIndex); 
            if (idx !== -1 && idx < matchedIndex) { 
              matchedIndex = idx; 
              matchedKeyword = keyword; 
            } 
          } 
          // 더 이상 키워드가 없으면 나머지 출력 
          if (!matchedKeyword) { 
            if (currentIndex < line.length) { 
              lineParts.push( 
                <Text key={`text-${lineIndex}-${currentIndex}`}> 
                  {line.slice(currentIndex)} 
                </Text> 
              ); 
            } 
            break; 
          } 
          // 키워드 전 텍스트 
          if (matchedIndex > currentIndex) { 
            lineParts.push( 
              <Text key={`text-${lineIndex}-${currentIndex}`}> 
                {line.slice(currentIndex, matchedIndex)} 
              </Text> 
            ); 
          } 
          // 키워드 
          lineParts.push( 
            <Text 
              key={`${matchedKeyword.id}-${lineIndex}-${matchedIndex}`} 
              style={[ 
                styles.highlight, 
                isSubtitle && styles.subtitle, 
              ]} 
              onPress={() => { 
                setSelectedWord(matchedKeyword!); 
                setModalVisible(true); 
              }} 
            >
             {matchedKeyword.word} 
            </Text> 
          ); 
          currentIndex = matchedIndex + matchedKeyword.word.length; 
        } 
        // 키워드가 하나도 없는 줄 
        if (lineParts.length === 0 && line.length > 0) { 
          lineParts.push( 
            <Text key={`line-${lineIndex}`}> 
              {line} 
            </Text> 
          ); 
        } 
        // 줄 전체를 Text로 감싸서 소제목이면 볼드 처리 
        parts.push( 
          <Text 
            key={`line-${lineIndex}`} 
            style={isSubtitle ? styles.subtitle : undefined} 
          > 
            {lineParts} 
          </Text> 
        ); 
        // 줄바꿈 유지 
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
        Alert.alert("성공", "단어장에 추가되었습니다!");
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Image source={{ uri: news.image_url }} style={styles.image} />

        <Text style={styles.title}>{news.title}</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.info}>
            {news.publisher}{"   "}
            {news.published_at.slice(0, 10).replace(/-/g, ".")}
          </Text>
        </View>

        
        <View style={styles.section}>
          {renderSummary()}
        </View>

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
            <Text style={styles.modalDescription}>{selectedWord?.explanation}</Text>

            <View style={styles.modalButtonRow}>
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
  title: { paddingHorizontal: 20, marginTop: 24, fontFamily: fonts.family.bold, fontSize: 26, color: colors.black, lineHeight: 36 },
  infoContainer: { alignItems: "flex-end", paddingHorizontal: 25, marginTop: 10, marginBottom: 10 },
  info: { fontFamily: fonts.family.regular, fontSize: 13, color: colors.black },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  body: { fontFamily: fonts.family.regular, fontSize: 17, color: colors.black, lineHeight: 31 },
  linkButton: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginLeft: 20, marginTop: 6, backgroundColor: "#FFF7DE", borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  linkText: { marginLeft: 6, fontFamily: fonts.family.bold, fontSize: 15, color: colors.black },
  buttonContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  modalCard: { width: "84%", backgroundColor: "#fff", borderRadius: 24, paddingHorizontal: 24, paddingVertical: 24, elevation: 8 },
  modalDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#F7D66E", marginBottom: 16 },
  modalTitle: { textAlign: "center", fontFamily: fonts.family.bold, fontSize: 26, color: colors.black, marginBottom: 16 },
  modalDescription: { textAlign: "center", fontFamily: fonts.family.regular, fontSize: 15, lineHeight: 24, color: colors.black },
  modalButtonRow: { flexDirection: "row", marginTop: 24 },
  closeButton: { flex: 1, borderWidth: 1.5, borderColor: "#F7D66E", borderRadius: 16, paddingVertical: 14, marginRight: 8 },
  closeButtonText: { textAlign: "center", color: "#F7D66E", fontFamily: fonts.family.bold, fontSize: 16 },
  saveButton: { flex: 1, backgroundColor: "#F7D66E", borderRadius: 16, paddingVertical: 14, marginLeft: 8 },
  saveButtonText: { textAlign: "center", color: colors.black, fontFamily: fonts.family.bold, fontSize: 16 },
  highlight: {
    fontFamily: fonts.family.bold,
    backgroundColor: "#F7D66E",
    color: colors.black,
  },
  subtitle: {
    fontFamily: fonts.family.bold,
  },
});