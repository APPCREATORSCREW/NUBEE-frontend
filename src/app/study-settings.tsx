import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { colors } from "../constants/colors";
import { Shadow } from "react-native-shadow-2";
import { fonts } from "../constants/fonts";
import { router } from "expo-router";
import { CircleLeft, DropDown, ToggleOff, ToggleOn } from "../components/icons";
import Button from "../components/common/Button";
import { useUserStore } from "../store/useUserStore";

const KEYWORD_OPTIONS = [3, 4, 5, 6];

// "17:30" -> Date
const parseTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Date -> "17:30"
const toStoredTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// "17:30" -> "오후 5:30"
const formatDisplayTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours < 12 ? "오전" : "오후";
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${minutes.toString().padStart(2, "0")}`;
};

const StudySettings = () => {
  const { settings, setSettings } = useUserStore();

  const [keywordCount, setKeywordCount] = useState(settings.keywordCount);
  const [notificationEnabled, setNotificationEnabled] = useState(
    settings.notificationEnabled,
  );
  const [notificationTime, setNotificationTime] = useState(
    settings.notificationTime,
  );

  const [isKeywordMenuOpen, setKeywordMenuOpen] = useState(false);
  const [isTimePickerOpen, setTimePickerOpen] = useState(false);
  const [keywordMenuPosition, setKeywordMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const selectViewRef = useRef<View>(null);

  // 키워드 수 설정
  const openKeywordMenu = () => {
    selectViewRef.current?.measureInWindow((x, y, width, height) => {
      setKeywordMenuPosition({ top: y + height + 24, left: x, width });
    });
    setKeywordMenuOpen(true);
  };

  const handleSelectKeywordCount = (count: number) => {
    setKeywordCount(count);
    setKeywordMenuOpen(false);
  };

  // 알림 시간 설정
  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS !== "ios") setTimePickerOpen(false);
    if (event.type === "dismissed") return;
    if (selectedDate) setNotificationTime(toStoredTime(selectedDate));
  };

  // 저장
  const handleSave = () => {
    setSettings({ keywordCount, notificationEnabled, notificationTime });
    // 학습 설정 API 연동은 추후 작업
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
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
              <Pressable
                ref={selectViewRef}
                style={styles.selectView}
                onPress={openKeywordMenu}
              >
                <View style={styles.selectSpacer} />
                <Text style={styles.selectText}>{keywordCount}개</Text>
                <DropDown />
              </Pressable>
            </View>
          </Shadow>
        </View>

        {/* 학습 알림 설정 */}
        <Shadow distance={2} startColor="#00000020">
          <View style={styles.settingContainer}>
            <View style={styles.toggleContainer}>
              <Text style={styles.settingText}>매일 학습 알림</Text>
              <Pressable
                onPress={() => setNotificationEnabled((prev) => !prev)}
              >
                <View style={styles.toggleRadius}>
                  {notificationEnabled ? <ToggleOn /> : <ToggleOff />}
                </View>
              </Pressable>
            </View>
            <View style={styles.divider} />
            <Pressable
              style={styles.timeContainer}
              onPress={() => setTimePickerOpen(true)}
              disabled={!notificationEnabled}
            >
              <Text style={styles.settingText}>알림 시간</Text>
              <View style={styles.timeTextContainer}>
                <Text style={styles.settingText}>
                  {formatDisplayTime(notificationTime)}
                </Text>
              </View>
            </Pressable>
          </View>
        </Shadow>
      </View>

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <Button label="저장하기" variant="filled" onPress={handleSave} />
      </View>

      {/* 키워드 수 선택 메뉴 */}
      <Modal
        visible={isKeywordMenuOpen}
        transparent
        animationType="none"
        onRequestClose={() => setKeywordMenuOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setKeywordMenuOpen(false)}
        >
          <View
            style={[
              styles.keywordMenu,
              {
                top: keywordMenuPosition.top,
                left: keywordMenuPosition.left,
                width: keywordMenuPosition.width,
              },
            ]}
          >
            {KEYWORD_OPTIONS.map((count) => (
              <Pressable
                key={count}
                style={[
                  styles.keywordOption,
                  count === keywordCount && styles.keywordOptionSelected,
                ]}
                onPress={() => handleSelectKeywordCount(count)}
              >
                <Text style={styles.keywordOptionText}>{count}개</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* 알림 시간 선택 */}
      {/* UI 수정 작업 필요 */}
      {Platform.OS === "android" && isTimePickerOpen && (
        <DateTimePicker
          value={parseTime(notificationTime)}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
      {Platform.OS === "ios" && (
        <Modal
          visible={isTimePickerOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setTimePickerOpen(false)}
        >
          <Pressable
            style={styles.modalBackdropBottom}
            onPress={() => setTimePickerOpen(false)}
          >
            <Pressable style={styles.timePickerSheet}>
              <DateTimePicker
                value={parseTime(notificationTime)}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
              <View style={styles.timePickerConfirm}>
                <Button
                  label="확인"
                  variant="filled"
                  onPress={() => setTimePickerOpen(false)}
                />
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default StudySettings;

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
    alignItems: "center",
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
  modalBackdrop: {
    flex: 1,
  },
  keywordMenu: {
    position: "absolute",
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray100,
    overflow: "hidden",
  },
  keywordOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  keywordOptionSelected: {
    backgroundColor: colors.yellow100,
  },
  keywordOptionText: {
    textAlign: "center",
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  modalBackdropBottom: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  timePickerSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  timePickerConfirm: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
