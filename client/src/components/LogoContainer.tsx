import { useFocusEffect } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { useFadeInUp } from "@utils/animated";

interface Props {}

const LogoContainer: FC<Props> = (props) => {
  useFocusEffect(
    useCallback(() => {
      // Reset Animations
      startLogoAnimation();
      startLogo2Animation();
    }, [])
  );

  // Initialization of custom hooks for animations
  const {
    animatedStyle: LogoAnimatedStyle,
    startAnimation: startLogoAnimation,
  } = useFadeInUp(200, 7);

  const {
    animatedStyle: Logo2AnimatedStyle,
    startAnimation: startLogo2Animation,
  } = useFadeInUp(600, 5);

  return (
    <View style={styles.logoContainer}>
      <Animated.Image
        source={require("@assets/Icons/Logo.png")}
        style={[styles.logo, LogoAnimatedStyle]}
      />

      <Animated.Image
        source={require("@assets/Authentication/Welcome!.png")}
        style={[styles.welcome, Logo2AnimatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    resizeMode: "contain",
    width: "80%",
  },
  welcome: {
    resizeMode: "contain",
    width: "35%",
    marginTop: -70,
  },
});

export default LogoContainer;
