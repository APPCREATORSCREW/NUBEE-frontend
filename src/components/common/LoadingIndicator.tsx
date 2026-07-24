import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  scale?: number;
}

const LoadingIndicator = ({ fullScreen = false, size = 'large', scale = 2.0 }: Props) => (
  <View style={fullScreen ? styles.overlay : styles.inline}>
    <ActivityIndicator size={size} color={colors.yellow400} style={{ transform: [{ scale: scale }] }} />
  </View>
);

export default LoadingIndicator;

const styles = StyleSheet.create({
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.background}CC`,
    zIndex: 10,
  },
});
