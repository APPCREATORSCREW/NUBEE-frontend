import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const ANDROID_CHANNEL_ID = "default";

// 앱이 foreground(켜져있는 상태)일 때도 알림 배너를 띄우도록 설정
// 앱 시작 시 한 번만 호출하면 됨 (_layout.tsx)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: "학습 알림",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
};

// 이미 허용된 상태면 재요청 없이 바로 true 반환 (iOS는 거부 후 재요청해도 시스템 팝업이 안 뜸)
export const requestNotificationPermission = async () => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const cancelStudyNotification = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// "17:30" 같은 "HH:mm" 형식을 받아 매일 반복 알림으로 재예약
export const scheduleDailyStudyNotification = async (time: string) => {
  await cancelStudyNotification();
  await ensureAndroidChannel();

  const [hour, minute] = time.split(":").map(Number);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "학습 알림",
      body: "오늘의 학습을 시작해보세요!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
};
