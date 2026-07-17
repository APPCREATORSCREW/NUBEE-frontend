import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';
import Button from '../components/common/Button';

const nubeeIcon = require('../../assets/icons/nubee-icon.png');

// 여기에 인증 분기 ...?
// 테스트용 임시 라우팅, merge 시 변경 필요
const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.iconContainer}>
        <Image source={nubeeIcon} style={styles.icon} resizeMode="contain" />
      </View>

      <View style={styles.buttonGroup}>
        <Text style={styles.tempLabel}>임시버튼</Text>
        <Button
          label="스플래시로 이동"
          variant="outlined"
          onPress={() => router.replace('/splash')}
        />
        <Button
          label="홈으로 이동"
          variant="outlined"
          onPress={() => router.replace('/home')}
        />
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    overflow: 'visible',
    marginBottom: 140,
  },
  icon: {
    width: 158,
    height: 198,
    alignSelf: 'center',
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    paddingHorizontal: 20,
    gap: 12,
  },
  tempLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
});
