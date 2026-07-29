import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../../constants/colors";
import { fonts } from "../../constants/fonts";
import { Levelup, New, SkinLock, SkinUnlock } from "../icons";

type Props = {
  visible?: boolean;
  skinName?: string;
  skinImage?: ImageSourcePropType;
  onClose?: () => void;
};

const DEFAULT_SKIN_IMAGE = require("../../../assets/skins/skin_origin.png");

const LevelUp = ({
  visible = true,
  skinName = "오리지널",
  skinImage = DEFAULT_SKIN_IMAGE,
  onClose,
}: Props) => {
  const [showCard, setShowCard] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const levelUpOpacity = useRef(new Animated.Value(0)).current;
  const levelUpScale = useRef(new Animated.Value(0.8)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const unlockScale = useRef(new Animated.Value(0)).current;
  const unlockOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    setShowCard(false);
    setIsUnlocked(false);
    levelUpOpacity.setValue(0);
    levelUpScale.setValue(0.8);
    shakeX.setValue(0);
    unlockScale.setValue(0);
    unlockOpacity.setValue(1);

    const shakeAnimation = Animated.sequence([
      Animated.delay(500),
      Animated.timing(shakeX, {
        toValue: -6,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 6,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: -6,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 6,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(shakeX, {
        toValue: 0,
        duration: 90,
        useNativeDriver: true,
      }),
    ]);

    const unlockAnimation = Animated.sequence([
      Animated.spring(unlockScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.delay(50),
      Animated.timing(unlockOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]);

    const startShakeAnimation = () => {
      shakeAnimation.start(({ finished }) => {
        if (!finished) return;

        setIsUnlocked(true);
        unlockAnimation.start();
      });
    };

    // level up -> lock icon -> unlock icon -> stop
    const levelUpAnimation = Animated.sequence([
      Animated.parallel([
        Animated.timing(levelUpOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(levelUpScale, {
          toValue: 1,
          friction: 5,
          tension: 90,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.timing(levelUpOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);

    levelUpAnimation.start(({ finished }) => {
      if (!finished) return;

      setShowCard(true);
      startShakeAnimation();
    });

    return () => {
      levelUpAnimation.stop();
      shakeAnimation.stop();
      unlockAnimation.stop();
      levelUpOpacity.stopAnimation();
      levelUpScale.stopAnimation();
      unlockScale.stopAnimation();
      unlockOpacity.stopAnimation();
    };
  }, [
    visible,
    levelUpOpacity,
    levelUpScale,
    shakeX,
    unlockScale,
    unlockOpacity,
  ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        {showCard ? (
          <Pressable
            style={styles.previewCard}
            onPress={(event) => event.stopPropagation()}
          >
            <New />

            <View style={styles.previewImageWrapper}>
              <Image source={skinImage} style={styles.previewImage} />

              <View style={styles.lockIcon} pointerEvents="none">
                {isUnlocked ? (
                  <Animated.View
                    style={{
                      opacity: unlockOpacity,
                      transform: [{ scale: unlockScale }],
                    }}
                  >
                    <SkinUnlock />
                  </Animated.View>
                ) : (
                  <Animated.View
                    style={{
                      transform: [{ translateX: shakeX }],
                    }}
                  >
                    <SkinLock />
                  </Animated.View>
                )}
              </View>
            </View>

            <Text style={styles.previewTitle}>{skinName}</Text>
          </Pressable>
        ) : (
          <View style={styles.levelupIcon} pointerEvents="none">
            <Animated.View
              pointerEvents="none"
              style={{
                opacity: levelUpOpacity,
                transform: [{ scale: levelUpScale }],
              }}
            >
              <Levelup />
            </Animated.View>
          </View>
        )}
      </Pressable>
    </Modal>
  );
};

export default LevelUp;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  previewCard: {
    width: 250,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  previewTitle: {
    fontFamily: fonts.family.bold,
    fontSize: fonts.size.title,
    letterSpacing: fonts.letterSpacing.title,
    color: colors.black,
  },
  previewImageWrapper: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    marginVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.yellow100,
  },
  previewImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  lockIcon: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  levelupIcon: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: 0 }, { translateY: -150 }],
  },
});
