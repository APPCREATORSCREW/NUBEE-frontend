import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import MenuArrow from "../icons/MenuArrow";

const MENUS = [
  { label: "비밀번호 변경", route: "/change-password" },
  { label: "학습 설정", route: "/study-settings" },
  { label: "로그아웃", route: null },
];

const MenuList = () => {
  const router = useRouter();

  const handlePress = (route: string | null) => {
    if (route) router.push(route as any);
    // 로그아웃 로직은 추후 스토어 연동
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
