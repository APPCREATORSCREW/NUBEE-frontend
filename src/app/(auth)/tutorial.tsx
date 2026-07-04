import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

// TODO: Figma/기능 명세서 수정필요 - 튜토리얼 화면 시안 및 기능 명세 전달되면 구현
const TutorialScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>튜토리얼</Text>
    </View>
  );
};

export default TutorialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
  },
});
