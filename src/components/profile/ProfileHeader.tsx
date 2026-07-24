import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import * as ImagePicker from "expo-image-picker";
import Edit from "../icons/Edit";
import { useUserStore } from "../../store/useUserStore";
import { updateProfileImage } from "../../apis/profileAPI";
import { getPresignedUrl, uploadToS3 } from "../../apis/s3API";

const ProfileHeader = () => {
  const user = useUserStore((state) => state.user);
  const setProfileImage = useUserStore((state) => state.setProfileImage);

  const pickImage = async () => {
    // 갤러리 권한 요청
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status != "granted") {
      alert("갤러리 접근 권한이 필요합니다.");
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
      const asset = result.assets[0];
      const fileName = asset.fileName ?? asset.uri.split("/").pop() ?? `profile_${Date.now()}.jpg`;
      const contentType = asset.mimeType ?? "image/jpeg";

      try {
        // presigned URL 요청엔 정확한 contentLength가 필요해서, 피커가 주는 메타데이터 대신
        // 실제 파일을 fetch해서 얻은 blob 크기를 사용 (업로드에도 이 blob을 그대로 재사용)
        const fileResponse = await fetch(asset.uri);
        const blob = await fileResponse.blob();

        // 1. 백엔드에 presigned URL 요청 (fileUrl은 서버가 미리 알려주는 최종 공개 URL)
        const { uploadUrl, fileUrl } = await getPresignedUrl({
          fileName,
          contentType,
          contentLength: blob.size,
        });
        // 2. URL로 S3에 파일 직접 업로드
        await uploadToS3(uploadUrl, blob, contentType);
        // 3. 최종 URL을 백엔드에 저장 요청 (서버엔 깨끗한 URL 저장)
        await updateProfileImage(fileUrl);
        // 같은 파일명으로 재업로드하면 URL이 동일해서 RN Image 캐시가 새 이미지로
        // 안 바뀔 수 있음 - 로컬 표시용으로만 캐시 무효화 쿼리스트링을 붙임
        const displayUrl = `${fileUrl}?t=${Date.now()}`;
        console.log("설정할 profileImage:", displayUrl); // 임시
        setProfileImage(displayUrl);
      } catch (error) {
        // TODO: 실패 시 에러 UI 처리
        console.error("프로필 이미지 업로드 실패", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={pickImage}>
        {/* Image Wrapper */}
        <View style={styles.imageWrapper}>
          {/* Image */}
          <Image
            source={
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
      <Text style={styles.username}>{user?.name ?? ""}</Text>
      <Text style={styles.email}>{user?.email ?? ""}</Text>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  imageWrapper: {
    width: 80,
    height: 80,
    position: "relative",
    borderRadius: 16,
    backgroundColor: colors.yellow100,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
  },
});
