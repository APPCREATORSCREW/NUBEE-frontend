import React, { useEffect, useState } from "react";
import { getNewsHistory, NewsItem } from "../../apis/review";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";

import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ReviewScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initCategoriesAndNews();
  }, []);

  useEffect(() => {
    if (selected) {
      loadNews(selected);
    }
  }, [selected]);

  const initCategoriesAndNews = async () => {
    try {
      setLoading(true);

      const initialCategory = "경제"; 
      const data = await getNewsHistory(initialCategory);

      if (data.isSuccess) {
        
        const fetchedNews = data.result.news || [];
        setNewsList(fetchedNews);
        
      
        const activeCategory = data.result.category || initialCategory;
        
        const dynamicCategories = Array.from(
          new Set([activeCategory, "경제", "사회", "과학", "세계"])
        );
        
        setCategories(dynamicCategories);
        setSelected(activeCategory);
      }
    } catch (error: any) {
      Alert.alert("카테고리 API 에러", getErrorMessage(error));
      setLoading(false);
    }
  };

  const loadNews = async (category: string) => {
    try {
      setLoading(true);
      const data = await getNewsHistory(category);

      if (data.isSuccess) {
        setNewsList(data.result.news);
      } else {
        setNewsList([]);
      }
    } catch (error) {
      console.error(error);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  const renderNewsCard = (item: NewsItem, index: number, array: NewsItem[]) => {
    const month = item.viewedAt ? item.viewedAt.slice(0, 7).replace("-", ".") : "";
    const date = item.viewedAt ? item.viewedAt.slice(0, 10).replace(/-/g, ".") : "";

    const prevMonth =
      index > 0 && array[index - 1].viewedAt
        ? array[index - 1].viewedAt.slice(0, 7).replace("-", ".")
        : "";

    const isFirstOfMonth = index === 0 || prevMonth !== month;

    return (
      <View key={item.newsId}>
        {isFirstOfMonth && month !== "" && (
          <View style={styles.monthChip}>
            <Text style={styles.monthText}>{month}</Text>
          </View>
        )}

        <View style={styles.newsCard}>
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.newsContent}>
            <Text style={styles.newsTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.newsDate}>{date}</Text>
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
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.black} />
          </View>
        ) : newsList.length > 0 ? (
          newsList.map((item, index, array) =>
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
    backgroundColor: colors.background,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginBottom: 30,
    paddingTop: 20,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray400,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  tabText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.gray400,
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
    paddingHorizontal: 0,
    paddingBottom: 20,
    flexGrow: 1,
  },
  monthChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray400,
    marginBottom: 18,
    marginTop: 5,
  },
  monthText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.gray400,
  },
  newsCard: {
    flexDirection: "row",
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    padding: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    alignItems: "center",
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
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    lineHeight: 24,
  },
  newsDate: {
    marginTop: 12,
    alignSelf: "flex-end",
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
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
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});