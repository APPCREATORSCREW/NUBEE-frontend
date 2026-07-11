import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';

const mascot = require('../../../assets/skins/skin_origin.png');
const KAKAO_YELLOW = '#FEE500';

const SplashScreen = () => {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[colors.yellow400, colors.yellow400, colors.background]}
      locations={[0, 0.1, 0.7]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image source={mascot} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.welcome}>누비에 오신 것을 환영합니다!</Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button label="로그인" variant="filled" onPress={() => router.push('/login')} />
        <Button label="회원가입" variant="outlined" onPress={() => router.push('/signup')} />
        <Pressable style={({ pressed }) => [styles.kakaoButton, pressed && { opacity: 0.8 }]}>
          <Text style={styles.kakaoLabel}>카카오 로그인 자리</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    gap: 30,
    marginTop: 80,
    justifyContent: 'center',
  },
  mascot: {
    width: 150,
    height: 150,
  },
  welcome: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
  buttonGroup: {
    gap: 27,
    marginBottom: 70,
  },
  kakaoButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KAKAO_YELLOW,
  },
  kakaoIcon: {
    fontSize: fonts.size.body,
    marginRight: 6,
  },
  kakaoLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});
