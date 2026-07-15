import { View, StyleSheet } from 'react-native';
import Button from '../../components/common/Button';

const Home = () => {
  return (
    <View style={styles.container}>
      <Button label="버튼" variant="filled" />
      <Button label="버튼" variant="outlined" />
      <Button label="버튼" variant="disabled" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
});
