import { Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { Lock } from "../icons";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import type { Skin } from "../../store/useSkinStore";

type Props = {
  skin: Skin;
  locked: boolean;
  selected?: boolean;
  onPress?: () => void;
};

const SkinItem = ({ skin, locked, selected, onPress }: Props) => {
  return (
    <Pressable
      style={[
        styles.container,
        !locked && styles.unlocked,
        selected && styles.selected,
      ]}
      onPress={onPress}
      disabled={locked}
    >
      {locked ? (
        <>
          <Lock />
          <Text style={styles.levelText}>Level {skin.requiredLevel}</Text>
        </>
      ) : (
        <Image source={skin.image} style={styles.image} />
      )}
    </Pressable>
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
  selected: {
    borderWidth: 2,
    borderColor: colors.yellow400,
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
});
