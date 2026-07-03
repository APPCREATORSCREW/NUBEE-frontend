//  하단 탭바 설정
//  모든 화면에 하단 탭바 보이도록 설정
import { Tabs } from 'expo-router';
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import HomeFill from '../../components/icons/tab/HomeFill';
import HomeOutline from '../../components/icons/tab/HomeOutline';
import Book4Fill from '../../components/icons/tab/Book4Fill';
import Book4Outline from '../../components/icons/tab/Book4Outline';
import Flag2Fill from '../../components/icons/tab/Flag2Fill';
import Flag2Outline from '../../components/icons/tab/Flag2Outline';
import PersonFill from '../../components/icons/tab/PersonFill';
import PersonOutline from '../../components/icons/tab/PersonOutline';

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.black,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.yellow100,
          height: 92,
          paddingTop: 12,
          paddingHorizontal: 16,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.family.regular,
          fontSize: fonts.size.caption,
          letterSpacing: fonts.letterSpacing.caption, 
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          tabBarIcon: ({ focused }) => (
            focused ? <HomeFill /> : <HomeOutline />
          ),
        }}
      />
      <Tabs.Screen
        name="wordbook"
        options={{
          title: '단어장',
          tabBarIcon: ({ focused }) => (
            focused ? <Book4Fill /> : <Book4Outline />
          ),
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '복습',
          tabBarIcon: ({ focused }) => (
            focused ? <Flag2Fill /> : <Flag2Outline />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          tabBarIcon: ({ focused }) => (
            focused ? <PersonFill /> : <PersonOutline />
          ),
        }}
      />
    </Tabs>
  );
}
export default TabsLayout;