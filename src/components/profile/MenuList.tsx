import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import MenuArrow from "../icons/MenuArrow";
import { useUserStore } from "../../store/useUserStore";
import { tokenStorage } from "../../store/tokenStorage";
import { logoutAPI } from "../../apis/profileAPI";

const MENUS = [
  { label: "비밀번호 변경", route: "/change-password" },
  { label: "학습 설정", route: "/study-settings" },
  { label: "로그아웃", route: null },
];

const MenuList = () => {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);

  const handlePress = async (route: string | null) => {
    if (route) {
      router.push(route as any);
      return;
    }
    // route가 null인 항목은 "로그아웃" 하나뿐 (MENUS 참고)
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) await logoutAPI({ refreshToken });
    } catch (error) {
      // 서버 로그아웃 실패해도 로컬 정리는 계속 진행
      console.error("로그아웃 API 실패", error);
    }
    await logout(); // 로컬 정리 (SecureStore + zustand 상태 초기화)
    router.replace("/splash");
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      {MENUS.map((item) => (
        <View key={item.label}>
          <Pressable
            style={styles.item}
            onPress={() => handlePress(item.route)}
          >
            <Text style={styles.label}>{item.label}</Text>
            {item.route && <MenuArrow />}
          </Pressable>
          <View style={styles.divider} />
        </View>
      ))}
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 90,
  },
  item: {
    height: 50,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
  },
  label: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});
