import { View, Text, StyleSheet } from "react-native";
import React from "react";
import SvgProfilePolygon1 from "../icons/ProfilePolygon1";
import { fonts } from "../../constants/fonts";
import { colors } from "../../constants/colors";
import SvgProfilePolygon2 from "../icons/ProfilePolygon2";
import { useUserStore } from "../../store/useUserStore";

const StatCard = () => {
  const user = useUserStore((state) => state.user);
  const streak = user?.streak ?? 0;
  const points = user?.points ?? 0;

  return (
    <View style={styles.container}>
      {/* 연속학습 */}
      <View style={styles.polygon1Container}>
        <SvgProfilePolygon1 />
        <View style={styles.textContainer}>
          <Text style={styles.label}>연속학습</Text>
          <Text style={styles.streak}>{streak}</Text>
          <Text style={styles.label}>일차</Text>
        </View>
      </View>
      {/* 레벨 + 포인트 */}
      <View style={styles.polygon2Container}>
        <View style={styles.wrapper}>
          <SvgProfilePolygon2 />
          <View style={styles.textContainer}>
            <Text style={styles.label}>포인트</Text>
            <Text style={styles.points}>{points}</Text>
            <Text style={styles.label}>보유</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 200,
    position: "relative",
    marginTop: 42,
  },
  polygon1Container: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  polygon2Container: {
    position: "absolute",
    top: 65, // 피그마 수치로 조절
    right: 0,
    alignItems: "center",
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
  },
  streak: {
    fontFamily: fonts.family.bold,
    fontSize: 48, // fonts 파일에 size 추가하기
    letterSpacing: fonts.letterSpacing.body,
    color: colors.yellow400,
  },
  points: {
    fontFamily: fonts.family.bold,
    fontSize: 48, // fonts 파일에 size 추가하기
    letterSpacing: fonts.letterSpacing.body,
    color: colors.yellow100,
  },
  label: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
    marginTop: -4,
    marginBottom: -4,
  },
});
