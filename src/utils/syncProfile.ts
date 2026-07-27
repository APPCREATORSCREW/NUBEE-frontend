import { getProfile } from "../apis/profileAPI";
import { getSkinByApiId, useSkinStore } from "../store/useSkinStore";
import { useUserStore } from "../store/useUserStore";

// 서버의 최신 프로필을 전역 스토어에 반영
// 로그인/회원가입 완료 직후, 프로필 탭 진입 시 공통 사용
export const syncProfile = async () => {
  const profile = await getProfile();

  useUserStore.getState().updateUser({
    name: profile.username,
    email: profile.email,
    level: profile.currentLevel,
    streak: profile.currentStreak,
    points: profile.currentPoint,
    profileImage: profile.profileImageUrl,
  });

  const skinStore = useSkinStore.getState();
  skinStore.setLevel(profile.currentLevel);

  const equippedSkin = getSkinByApiId(profile.currentSkinId);
  if (equippedSkin) skinStore.selectSkin(equippedSkin.id);

  return profile;
};
