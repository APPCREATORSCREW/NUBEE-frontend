import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors';
import { fonts } from '../../constants/fonts';
import * as ImagePicker from 'expo-image-picker';
import Edit from '../icons/Edit';
import { useUserStore } from '../../store/useUserStore';

const ProfileHeader = () => {
  const user = useUserStore((state) => state.user);
  const setProfileImage = useUserStore((state) => state.setProfileImage);

  const pickImage = async () => {

    // 갤러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status != "granted") {
      alert("갤러리 접근 권한이 필요합니다.")
      return;
    }

    // 갤러리 열기
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>

        {/* Image Wrapper */}
        <View style={styles.imageWrapper} >

          {/* Image */}
          <Image source={
          user?.profileImage
          ? { uri: user.profileImage }
          : require("../../../assets/skins/skin_origin.png")
          }
          style={[styles.image, !user?.profileImage && styles.originImage]}
          />

          {/* Icon */}
          <View style={styles.editIcon}>
            <Edit />
          </View>
        </View>
      </Pressable>

      {/* user 프로필 정보 */}
      <Text style={styles.username}>{user?.name ?? ''}</Text>
      <Text style={styles.email}>{user?.email ?? ''}</Text>
    </View>
  )
}

export default ProfileHeader

const styles = StyleSheet.create({
    container: {
      alignItems: "center"
    },
    imageWrapper: {
      width: 80,
      height: 80,
      position: "relative",
      borderRadius: 16,
      backgroundColor: colors.yellow100,
      alignItems: "center",
      justifyContent: "center",
      overflow: 'hidden',
      marginBottom: 24,
    },
    image: {
      width: 80,
      height: 80,
    },
    originImage: {
      width: 46,
      height: 46,
    },
    editIcon: {
      position: "absolute",
      bottom: 0,
      right: 0,
    },
    username: {
      fontFamily: fonts.family.bold,
      fontSize: fonts.size.title,
      letterSpacing: fonts.letterSpacing.title,
      color: colors.black,
      marginBottom: 8,
    },
    email: {
      fontFamily: fonts.family.regular,
      fontSize: fonts.size.caption,
      letterSpacing: fonts.letterSpacing.caption,
      color: colors.black,
    }
  });