import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../../constants/colors";
import ProfileHeader from "../../components/profile/ProfileHeader";
import { StarShine } from "../../components/icons";
import { fonts } from "../../constants/fonts";
import SkinList from "../../components/profile/SkinList";
import { SafeAreaView } from "react-native-safe-area-context";
import MenuList from "../../components/profile/MenuList";
import StatCard from "../../components/profile/StatCard";
import ProgressBar from "../../components/profile/ProgressBar";
import { useUserStore, POINTS_PER_LEVEL } from "../../store/useUserStore";
import { useSkinStore, getSkinByApiId } from "../../store/useSkinStore";
import { getProfile } from "../../api/profileAPI";

const Profile = () => {
  const points = useUserStore((state) => state.user?.points ?? 0);
  const level = useUserStore((state) => state.user?.level ?? 0);
  const updateUser = useUserStore((state) => state.updateUser);
  const setSkinLevel = useSkinStore((state) => state.setLevel);
  const selectSkin = useSkinStore((state) => state.selectSkin);

  // 프로필 화면 진입 시 GET /api/users/profile 호출해서 최신 정보로 갱신
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();

        // 서버 응답 필드명 -> 로컬 User 타입 필드명 매핑
        updateUser({
          name: profile.username,
          email: profile.email,
          level: profile.currentLevel,
          streak: profile.currentStreak,
          points: profile.currentPoint,
          profileImage: profile.profileImageUrl,
        });

        // 스킨 잠금 계산에 쓰이는 레벨도 같이 동기화
        setSkinLevel(profile.currentLevel);

        // 현재 적용 중인 스킨도 반영 (서버는 apiId 기준 숫자 id를 줌)
        const equippedSkin = getSkinByApiId(profile.currentSkinId);
        if (equippedSkin) selectSkin(equippedSkin.id);
      } catch (error) {
        // TODO: 실패 시 에러 UI 처리, 지금은 임시 유저 값 유지한 채로 조용히 무시
        console.error("프로필 조회 실패", error);
      }
    };

    fetchProfile();
  }, []);

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
        <ProfileHeader />
        {/* 프로그레스 바 */}
        <ProgressBar level={level} progress={points / POINTS_PER_LEVEL} />
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
