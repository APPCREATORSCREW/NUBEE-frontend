// 인증 화면들엔 탭바 없이 스택 네비게이션만
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} />;
}
export default AuthLayout;