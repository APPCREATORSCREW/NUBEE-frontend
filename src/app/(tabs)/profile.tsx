import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import ProfileHeader from '../../components/profile/ProfileHeader';

const Profile = () => {
  return (
    <View style={styles.container}>
      <ProfileHeader username='눈송이' email='nubee@example.com' />
    </View>
  );
}
export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
});