import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import Button from '../../components/common/Button';
import { useUserStore } from '../../store/useUserStore';

const OPTIONS = [
  { count: 3, background: colors.yellow100, border: colors.yellow400 },
  { count: 4, background: colors.green100, border: colors.green400 },
  { count: 5, background: colors.blue100, border: colors.blue400 },
  { count: 6, background: colors.pink100, border: colors.pink400 },
];

const SelectKeywordScreen = () => {
  const router = useRouter();
  const setSettings = useUserStore((state) => state.setSettings);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);

  const handleStart = () => {
    if (selectedCount === null) return;
    setSettings({ keywordCount: selectedCount });
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        하루에 볼 <Text style={styles.titleHighlight}>키워드</Text>
        {'\n'}개수를 선택해 주세요
      </Text>

      <View style={styles.grid}>
        {OPTIONS.map((option) => {
          const isSelected = selectedCount === option.count;
          return (
            <Pressable
              key={option.count}
              style={[
                styles.card,
                { backgroundColor: option.background },
                isSelected && { borderColor: option.border },
              ]}
              onPress={() => setSelectedCount(option.count)}
            >
              <Text style={styles.cardLabel}>{option.count}개</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          label="시작하기"
          variant={selectedCount !== null ? 'filled' : 'disabled'}
          onPress={handleStart}
        />
      </View>
    </View>
  );
};

export default SelectKeywordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.header,
    letterSpacing: fonts.letterSpacing.header,
    color: colors.black,
    marginTop: 60,
    marginBottom: 40,
  },
  titleHighlight: {
    color: colors.yellow400,
  },
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  card: {
    width: '48%',
    height: '48%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 65,
  },
});
