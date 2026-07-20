import { View, StyleSheet, Modal, Text, Image } from "react-native";
import React, { useState } from "react";
import SkinItem from "./SkinItem";
import {
  useSkinStore,
  SKINS,
  isSkinUnlocked,
  type Skin,
} from "../../store/useSkinStore";
import Button from "../common/Button";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";

const SkinList = () => {
  const level = useSkinStore((state) => state.level);
  const selectedSkinId = useSkinStore((state) => state.selectedSkinId);
  const selectSkin = useSkinStore((state) => state.selectSkin);

  const [previewSkin, setPreviewSkin] = useState<Skin | null>(null);

  const handleConfirm = () => {
    if (previewSkin) selectSkin(previewSkin.id);
    setPreviewSkin(null);
  };

  return (
    <>
      <View style={styles.grid}>
        {SKINS.map((skin) => {
          const locked = !isSkinUnlocked(skin.id, level);
          return (
            <SkinItem
              key={skin.id}
              skin={skin}
              locked={locked}
              selected={selectedSkinId === skin.id}
              onPress={locked ? undefined : () => setPreviewSkin(skin)}
            />
          );
        })}
      </View>

      <Modal
        visible={!!previewSkin}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewSkin(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{previewSkin?.name}</Text>
            <View style={styles.previewImageWrapper}>
              {previewSkin && (
                <Image source={previewSkin.image} style={styles.previewImage} />
              )}
            </View>
            <View style={styles.previewButtons}>
              <View style={styles.previewButton}>
                <Button
                  label="취소"
                  variant="outlined"
                  onPress={() => setPreviewSkin(null)}
                />
              </View>
              <View style={styles.previewButton}>
                <Button label="선택" variant="filled" onPress={handleConfirm} />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SkinList;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewCard: {
    width: 250,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  previewTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
    marginBottom: 16,
  },
  previewImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.yellow100,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  previewImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  previewButton: {
    flex: 1,
  },
});
