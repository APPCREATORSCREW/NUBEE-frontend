import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

// 버튼 타입 3종류
type ButtonVariant = 'filled' | 'outlined' | 'disabled';

interface Props {
  label: string;
  variant?: ButtonVariant;
  onPress?: () => void;
}

const Button = ({ label, variant = 'filled', onPress }: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && { opacity: 0.8 },
      ]}
      onPress={onPress}
      disabled={variant === 'disabled'}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: colors.yellow400,
  },
  outlined: {
    backgroundColor: colors.yellow100,
    borderWidth: 1,
    borderColor: colors.yellow400,
  },
  disabled: {
    backgroundColor: colors.gray400,
  },
  label: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
});
