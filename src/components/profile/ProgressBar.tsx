import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { QuestionMark } from "../icons";

type Props = {
  level: number;
  progress: number; // 0 ~ 1
};

const { width: windowWidth } = Dimensions.get("window");

const ProgressBar = ({ level, progress }: Props) => {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const [isInfoOpen, setInfoOpen] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, right: 0 });
  const iconRef = useRef<View>(null);

  const openInfo = () => {
    iconRef.current?.measureInWindow((x, y, width, height) => {
      setTooltipPosition({
        top: y + height + 8,
        right: windowWidth - (x + width),
      });
    });
    setInfoOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.levelText}>LV.{level}</Text>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
      </View>
      <Pressable ref={iconRef} onPress={openInfo}>
        <QuestionMark />
      </Pressable>

      <Modal
        visible={isInfoOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setInfoOpen(false)}
        >
          <View
            style={[
              styles.tooltip,
              { top: tooltipPosition.top, right: tooltipPosition.right },
            ]}
          >
            <Text style={styles.tooltipText}>
              50포인트를 모으면 레벨 업 해요{"\n"}학습을 통해 포인트를
              모아보세요!
            </Text>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  levelText: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.body,
    letterSpacing: fonts.letterSpacing.body,
    color: colors.black,
  },
  bar: {
    flex: 1,
    height: 12,
    borderRadius: 16,
    backgroundColor: colors.yellow100,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 16,
    backgroundColor: colors.yellow400,
  },
  modalBackdrop: {
    flex: 1,
    top: 16,
    left: 16,
  },
  tooltip: {
    position: "absolute",
    maxWidth: 220,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: colors.gray400,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 4,
  },
  tooltipText: {
    fontFamily: fonts.family.regular,
    fontSize: fonts.size.label,
    letterSpacing: fonts.letterSpacing.label,
    color: colors.black,
  },
});
