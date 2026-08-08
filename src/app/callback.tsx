import { useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { useUserStore } from "../store/useUserStore";
import { tokenStorage } from "../utils/tokenStorage";
import { colors } from "../constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CallbackScreen() {
  const params = useLocalSearchParams();

  const access_token = params.access_token as string;
  const refresh_token = params.refresh_token as string;
  const is_new = params.is_new as string;
  const error = params.error as string;

  useEffect(() => {
    const handleLogin = async () => {
      try {
        if (error) {
          Alert.alert("로그인 실패", error);
          router.replace("/(auth)/splash");
          return;
        }

        if (!access_token || !refresh_token) {
          Alert.alert("로그인 오류", "토큰을 받아오지 못했습니다.");
          router.replace("/(auth)/splash");
          return;
        }

        useUserStore.getState().setAccessToken(access_token);

        await tokenStorage.saveRefreshToken(refresh_token);

        
        router.replace("/(tabs)/home");
        
      } catch (e) {
        Alert.alert("오류", "로그인 처리 중 문제가 발생했습니다.");

        router.replace("/(auth)/splash");
      }
    };

    handleLogin();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.black} />
    </SafeAreaView>
  );
}
