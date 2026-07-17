import { useEffect } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    'Pretendard-Regular': require('../../assets/fonts/pretendard-Regular.otf'),
    'Pretendard-Bold': require('../../assets/fonts/pretendard-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
export default RootLayout;

export const fonts = {
    family: {
        regular: "Pretendard-Regular",
        bold: "Pretendard-Bold",
      },
      size: {
        caption: 11,
        label: 13,
        body: 15,
        title: 20,
        header: 24,
      },
      letterSpacing: {
        caption: 11 * -0.02,
        label: 13 * -0.02,
        body: 15 * -0.02,
        title: 20 * -0.02,
        header: 24 * -0.02,
      },		
} as const;