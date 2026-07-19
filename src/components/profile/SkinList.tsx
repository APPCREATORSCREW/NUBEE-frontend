import { View, StyleSheet } from "react-native";
import React from "react";
import SkinItem from "./SkinItem";
import { useSkinStore, SKINS, isSkinUnlocked } from "../../store/useSkinStore";

const SkinList = () => {
  const level = useSkinStore((state) => state.level);
  const selectedSkinId = useSkinStore((state) => state.selectedSkinId);
  const selectSkin = useSkinStore((state) => state.selectSkin);

  return (
    <View style={styles.grid}>
      {SKINS.map((skin) => {
        const locked = !isSkinUnlocked(skin.id, level);
        return (
          <SkinItem
            key={skin.id}
            skin={skin}
            locked={locked}
            selected={selectedSkinId === skin.id}
            onPress={locked ? undefined : () => selectSkin(skin.id)}
          />
        );
      })}
    </View>
  );
};

export default SkinList;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
