//  하단 탭바 설정
//  모든 화면에 하단 탭바 보이도록 설정
import { Tabs } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.yellow400,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.yellow100,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.family.regular,
          fontSize: fonts.size.caption,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => (
            
          ),
        }}
      />
      <Tabs.Screen
        name="wordbook"
        options={{
          title: '단어장',
          tabBarIcon: ({ color }) => (
            
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '복습',
          tabBarIcon: ({ color }) => (
            
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ color }) => (
            
          ),
        }}
      />
    </Tabs>
  );
}
export default TabsLayout;