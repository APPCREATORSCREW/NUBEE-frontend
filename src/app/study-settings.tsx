import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";
import { Shadow } from "react-native-shadow-2";
import { fonts } from "../constants/fonts";
import { router } from "expo-router";
import { CircleLeft, DropDown, ToggleOff, ToggleOn } from "../components/icons";
import Button from "../components/common/Button";

const studySettings = () => {
  // 키워드 개수 드롭다운

  // 학습 알림 토글 스위치 on off

  // 학습 알림 시간 설정

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Shadow distance={2} startColor="#00000020">
              <View style={styles.iconRadius}>
                <CircleLeft />
              </View>
            </Shadow>
          </Pressable>
          <Text style={styles.headerTitle}>학습 설정</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerCaption}>
          하루에 몇 개의 뉴스를 읽고 싶나요?
        </Text>
        {/* 키워드 수 설정 */}
        <View style={styles.container}>
          <Shadow distance={2} startColor="#00000020">
            <View style={styles.settingContainer}>
              <Text style={styles.settingText}>하루 학습 키워드 수</Text>
              <View style={styles.selectView}>
                <View style={styles.selectSpacer}></View>
                <Text style={styles.selectText}>3개</Text>
                <Pressable onPress={() => {}}>
                  <DropDown />
                </Pressable>
              </View>
            </View>
          </Shadow>
        </View>

        {/* 학습 알림 설정 */}
        <Shadow distance={2} startColor="#00000020">
          <View style={styles.settingContainer}>
            <View style={styles.toggleContainer}>
              <Text style={styles.settingText}>매일 학습 알림</Text>
              <Pressable onPress={() => {}}>
                <Shadow distance={2} startColor="#00000020">
                  <View style={styles.toggleRadius}>
                    <ToggleOn />
                  </View>
                </Shadow>
              </Pressable>
            </View>
            <View style={styles.divider}></View>
            <Pressable style={styles.timeContainer} onPress={() => {}}>
              <Text style={styles.settingText}>알림 시간</Text>
              <View style={styles.timeTextContainer}>
                <Text style={styles.settingText}>오후 5:30</Text>
              </View>
            </Pressable>
          </View>
        </Shadow>
      </View>

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <Button label="저장하기" variant="filled" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};

export default studySettings;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  iconRadius: {
    borderRadius: 23,
  },
  toggleRadius: {
    borderRadius: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
  },
  headerSpacer: {
    width: 46,
  },
  headerCaption: {
    textAlign: "center",
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.gray400,
    marginBottom: 40,
  },
  container: {
    marginBottom: 32,
  },
  settingContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    borderRadius: 16,
    width: "100%",
  },
  settingText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  selectView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.yellow100,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: "100%",
  },
  selectSpacer: {
    width: 24,
  },
  selectText: {
    textAlign: "center",
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  toggleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
    marginBottom: 16,
  },
  timeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeTextContainer: {
    backgroundColor: colors.yellow100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  buttonContainer: {
    paddingBottom: 80,
  },
});
