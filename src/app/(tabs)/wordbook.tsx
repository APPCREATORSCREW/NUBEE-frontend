import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Button from "../../components/common/Button";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

// 더미 데이터
const todayWords = [
  {
    word_id: 1,
    word: "반도체",
    description: "상황에 따라 전기를 잘 흐르게 하거나 막는 특별한 재료",
  },
  {
    word_id: 2,
    word: "금리",
    description: "돈을 빌릴 때 내는 사용료 비율",
  },
  {
    word_id: 3,
    word: "기준 금리",
    description: "한국은행이 정하는 기본 금리",
  },
];

const previousWords = [
  {
    word_id: 4,
    word: "물가",
    description: "물건과 서비스의 전체적인 가격 수준",
  },
];

export default function Wordbook() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>단어장</Text>

        <Text style={styles.sectionTitle}>오늘 저장</Text>

        {todayWords.map((item) => (
          <View key={item.word_id} style={styles.card}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>이전에 저장</Text>

        {previousWords.map((item) => (
          <View key={item.word_id} style={styles.card}>
            <Text style={styles.word}>{item.word}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}

        <View style={{ height: 140 }} />
      </ScrollView>

      <View style={styles.buttonContainer}>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },

  title: {
    fontFamily: fonts.family.bold,
    fontSize: 30,
    color: colors.black,
    marginBottom: 20,
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

  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: colors.background,
  },
});