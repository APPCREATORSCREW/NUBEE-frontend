import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Button from "../components/common/Button";
import { colors } from "../constants/colors";
import { fonts } from "../constants/fonts";

const news = {
  image: "https://picsum.photos/900/500",
  title:
    "한국 성장률 전망 ‘쑥’…경기과열 조짐에 고개드는 금리 인상론",
  company: "매일경제",
  date: "2026.05.05",
};

const WORD = {
  title: "반도체",
  description:
    "상황에 따라 전기를 잘 흐르게도 하고 막기도 할 수 있는 특별한 재료예요. 전기를 켰다 껐다 할 수 있기 때문에 스마트폰이나 컴퓨터의 재료가 되고 그 안에서 중요한 역할을 해요.",
};

export default function News() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* 이미지 */}
        <Image
          source={{ uri: news.image }}
          style={styles.image}
        />

        {/* 제목 */}
        <Text style={styles.title}>{news.title}</Text>

        {/* 뉴스사 / 날짜 */}
        <View style={styles.infoContainer}>
          <Text style={styles.info}>
            {news.company}{"   "}
            {news.date}
          </Text>
        </View>

        {/* ===== 첫 번째 ===== */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            🏭 반도체가 잘 팔리고 있어요
          </Text>

          <Text style={styles.body}>
            요즘 우리나라{" "}
            
              <Text 
                style={styles.keyword}
                onPress={() => setModalVisible(true)}
              >
                반도체
              </Text>
            
            {" "}공장들이 AI 컴퓨터에 들어가는 부품을 엄청 많이 만들어
            팔고 있어요. 덕분에 회사들이 돈을 많이 벌고,
            사람들도 지갑을 더 열기 시작했어요.
            올해 3월 온라인 쇼핑 금액이 처음으로
            25조 원을 넘었을 정도예요!
            25조 원이 얼마냐고요?
            1만 원짜리 지폐를 25억 장 쌓은 것과 같아요.
          </Text>
        </View>

        {/* ===== 두 번째 ===== */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            📈 외국 은행들도 한국 경제를 높이 평가해요
          </Text>

          <Text style={styles.body}>
            미국의 큰 은행 JP모건은
            우리나라 올해 성장률{" "}
            
              <Text 
                style={styles.keyword}
                onPress={() => setModalVisible(true)}
              >
                전망
              </Text>
            
            을 2.2%에서 3.0%로 크게 올렸어요.
            다른 외국 은행들도 마찬가지예요.
            성장률이란 나라 경제가
            1년 동안 얼마나 커졌는지를
            나타내는 숫자예요.
            숫자가 클수록 경제가
            빠르게 성장하고 있다는 뜻이에요.
          </Text>
        </View>

        {/* ===== 세 번째 ===== */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            🛢️ 그런데 물건 값도 같이 오르고 있어요
          </Text>

          <Text style={styles.body}>
            경제가 빠르게 성장하면
            좋은 것만 있을 것 같지만
            문제도 생겨요.
            사람들이 돈을 많이 쓸수록{" "}
            
              <Text 
                style={styles.keyword}
                onPress={() => setModalVisible(true)}
              >
                물가
              </Text>
            
            가 올라가거든요.
            여기에 중동 지역에서
            전쟁이 일어나 기름값까지 오르면서
            물가가 더 빠르게 오르고 있어요.
            마트에서 사는 과자,
            음료수 같은 것들도
            조금씩 비싸지는 거예요.
          </Text>
        </View>

        {/* ===== 네 번째 ===== */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>
            🏦 한국은행이 금리를 올릴 수도 있어요
          </Text>

          <Text style={styles.body}>
            물가가 너무 오르는 걸 막으려면
            한국은행이 금리를 올려야 해요.
            금리를 올리면 돈을 빌리는 게 비싸지니까,
            사람들이 돈을 덜 빌리고
            덜 쓰게 돼요.
            그러면 물건 값이
            다시 안정될 수 있어요.
            마치 너무 뜨거운 냄비의
            불을 줄이는 것처럼요!
            한국은행은 이번 달 회의에서
            금리를 올릴지 말지
            결정할 예정이에요.
          </Text>
        </View>

        {/* 원문 링크 */}
        <Pressable style={styles.linkButton}>
          <Ionicons
            name="link-outline"
            size={20}
            color={colors.black}
          />

          <Text style={styles.linkText}>
            원문 보러 가기
          </Text>
        </Pressable>

        {/* 버튼 공간 */}
        <View style={{ height: 140 }} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>

            <View style={styles.modalDot} />

            <Text style={styles.modalTitle}>
              {WORD.title}
            </Text>

            <Text style={styles.modalDescription}>
              {WORD.description}
            </Text>

            <View style={styles.modalButtonRow}>

              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>
                  닫기
                </Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={() => {
                  // 단어장 저장 API
                  setModalVisible(false);
                }}
              >
                <Text style={styles.saveButtonText}>
                  단어장에 추가
                </Text>
              </Pressable>

            </View>

          </View>
        </View>
      </Modal>

      {/* 하단 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          label="퀴즈 풀기"
          variant="filled"
          onPress={() => router.push("/news-quiz")}
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
    paddingBottom: 20,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  title: {
    paddingHorizontal: 20,
    marginTop: 24,
    fontFamily: fonts.family.bold,
    fontSize: 28,
    color: colors.black,
    lineHeight: 38,
  },

  infoContainer: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 25,
  },

  info: {
    fontFamily: fonts.family.regular,
    fontSize: 13,
    color: colors.black,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  subtitle: {
    fontFamily: fonts.family.bold,
    fontSize: 20,
    color: colors.black,
    marginBottom: 14,
    lineHeight: 30,
  },

  body: {
    fontFamily: fonts.family.regular,
    fontSize: 17,
    color: colors.black,
    lineHeight: 31,
  },

  keyword: {
    fontFamily: fonts.family.bold,
    color: colors.black,
    backgroundColor: "#FFF2AB",
    fontSize: 17,
  },

linkButton: {
  alignSelf: "flex-start", // 내용 크기만큼만 너비
  flexDirection: "row",
  alignItems: "center",

  marginLeft: 20,
  marginTop: 6,

  backgroundColor: "#FFF7DE",
  borderRadius: 999,

  paddingHorizontal: 16,
  paddingVertical: 10,
},

  linkText: {
    marginLeft: 6,
    fontFamily: fonts.family.bold,
    fontSize: 15,
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

    borderRadius: 24,

    paddingHorizontal: 24,
    paddingVertical: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
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
    fontSize: 28,
    color: colors.black,
    marginBottom: 20,
  },

  modalDescription: {
    textAlign: "center",
    fontFamily: fonts.family.regular,
    fontSize: 17,
    lineHeight: 30,
    color: colors.black,
  },

  modalButtonRow: {
    flexDirection: "row",
    marginTop: 32,
  },

  closeButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#F7D66E",
    borderRadius: 16,
    paddingVertical: 14,
    marginRight: 8,
  },

  closeButtonText: {
    textAlign: "center",
    color: "#F7D66E",
    fontFamily: fonts.family.bold,
    fontSize: 16,
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#F7D66E",
    borderRadius: 16,
    paddingVertical: 14,
    marginLeft: 8,
  },

  saveButtonText: {
    textAlign: "center",
    color: colors.black,
    fontFamily: fonts.family.bold,
    fontSize: 16,
  },
});