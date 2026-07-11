import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";
import SkinItem from "./SkinItem";

// 따로 skin 파일 만들기
// 전역 상태 관리 필요
const SKINS = [
  {
    id: 1,
    skinName: "기본 벌",
    level: 1,
    image: require("../../../assets/skins/skin_origin.png"),
    locked: false,
  },
  { id: 2, skinName: "", level: 5, locked: true },
  { id: 3, skinName: "", level: 10, locked: true },
  { id: 4, skinName: "", level: 15, locked: true },
  { id: 5, skinName: "", level: 20, locked: true },
  { id: 6, skinName: "", level: 25, locked: true },
  { id: 7, skinName: "", level: 30, locked: true },
  { id: 8, skinName: "", level: 35, locked: true },
  { id: 9, skinName: "", level: 40, locked: true },
  { id: 10, skinName: "", level: 45, locked: true },
  { id: 11, skinName: "", level: 50, locked: true },
  { id: 12, skinName: "", level: 55, locked: true },
];

const SkinList = () => {
  return (
    <View>
      <FlatList
        data={SKINS}
        numColumns={4}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <SkinItem skin={item} />}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default SkinList;

const styles = StyleSheet.create({
  row: {
    gap: 10,
  },
  list: {
    gap: 14,
  },
});
