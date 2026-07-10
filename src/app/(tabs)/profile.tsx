import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import ProfileHeader from '../../components/profile/ProfileHeader';
import { StarShine } from '../../components/icons';
import { fonts } from '../../constants/fonts';

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* 프로필 헤더 */}
      <ProfileHeader username='눈송이' email='nubee@example.com' />
      {/* 스탯 카드 */}

      {/* 아이콘 + 텍스트 */}
      <View style={styles.starTextContainer}>
        <StarShine />
        <Text style={styles.starText}>레벨 업으로 꿀벌 스킨을 모아보세요!</Text>
      </View>
    </View>
  );
}
export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  starTextContainer: {
    width: 250,
    flexDirection: "row",
    gap: 2,
    alignContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: colors.yellow100,
    borderRadius: 16,
  },
  starText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  }
});