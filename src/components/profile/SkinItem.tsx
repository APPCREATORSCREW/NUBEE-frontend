import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Lock } from "../icons";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

type Skin = {
  id: number;
  skinName: string;
  level: number;
  image?: any;
  locked: boolean;
};

type Props = {
  skin: Skin;
};

const SkinItem = ({ skin }: Props) => {
  return (
    <View style={[styles.container, !skin.locked && styles.unlocked]}>
      {skin.locked ? (
        <>
          <Lock />
          <Text style={styles.levelText}>Level {skin.level}</Text>
        </>
      ) : (
        <Image source={skin.image} style={styles.image} />
      )}
    </View>
  );
};

export default SkinItem;

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray100,
  },
  unlocked: {
    backgroundColor: colors.yellow100,
  },
  image: {
    width: 80,
    height: 80,
  },
  levelText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.gray400,
  },

  // 현재 선택에 따른 변화 -> border 색상 yellow 굵기 2
});
