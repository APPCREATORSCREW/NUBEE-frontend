import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../constants/colors";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { StarShine } from "../../components/icons";
import { fonts } from "../../constants/fonts";
import SkinList from "../../components/profile/SkinList";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuList from "../../components/profile/MenuList";
import StatCard from "../../components/profile/StatCard";

const Profile = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 80,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 헤더 */}
        <ProfileHeader username="눈송이" email="nubee@example.com" />
        {/* 스탯 카드 */}
        <StatCard />
        {/* 아이콘 + 텍스트 */}
        <View style={styles.starTextContainer}>
          <StarShine />
          <Text style={styles.starText}>
            레벨 업으로 꿀벌 스킨을 모아보세요!
          </Text>
        </View>
        {/* 스킨 보관함 */}
        <SkinList />
        {/* 메뉴 리스트 */}
        <MenuList />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },
  starTextContainer: {
    width: 250,
    flexDirection: "row",
    gap: 2,
    alignContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 36,
    marginBottom: 18,
    backgroundColor: colors.yellow100,
    borderRadius: 16,
  },
  starText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});
