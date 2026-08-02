import { Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { tokenStorage } from '../utils/tokenStorage';
import axios from 'axios';
import { api } from '../apis/client';
import { RefreshResponse } from '../apis/auth';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { syncProfile } from '../utils/syncProfile';

const nubeeIcon = require('../../assets/icons/nubee-icon.png');

const Index = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsLoading(false);
        router.replace('/splash');
        return;
    }

    try {
      const { data } = await axios.post<RefreshResponse>(`${api.defaults.baseURL}/auth/token/refresh`, 
        { refreshToken }
      );
      useUserStore.getState().setAccessToken(data.result.accessToken);
      await tokenStorage.saveRefreshToken(data.result.refreshToken);
      await syncProfile();

      router.replace('/home');
    } 
    catch (error) {
      await tokenStorage.removeRefreshToken();
      router.replace('/splash');
    } 
    finally {
      setIsLoading(false);
    }
    };
    bootstrap();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={nubeeIcon} style={styles.icon} resizeMode="contain" />
      </View>
      {isLoading && <LoadingIndicator fullScreen />}
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
  },
  icon: {
    width: 158,
    height: 198,
    alignSelf: 'center',
  },
});
