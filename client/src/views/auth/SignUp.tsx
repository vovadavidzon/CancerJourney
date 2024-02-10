import AuthInputField from "@components/AuthInputField";
import AppInput from "@ui/AppInput";
import colors from "@utils/colors";
import { FC } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {}

const SignUp: FC<Props> = (props) => {
  const entering = () => {
    "worklet";
    const animations = {
      //translateY: withTiming(-30, { duration: 600 }),
      translateY: withSpring(-30, {
        mass: 1,
        damping: 7,
        stiffness: 23,
      }),
      // opacity: withTiming(1, { duration: 300 }),
    };
    const initialValues = {
      translateY: 190,
      // opacity: 1,
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          paddingTop: 30,
        }}
      >
        <Animated.Image
          entering={entering}
          source={require("@assets/Logo.png")}
          style={{
            resizeMode: "contain",
            width: "80%",
          }}
        />
      </View>
      <View style={{ height: 100, width: 150 }}>
        <Animated.Image
          entering={FadeInUp.delay(1000).duration(1000).springify().damping(3)}
          style={{ flex: 1, width: null, height: null, resizeMode: "contain" }}
          source={require("@assets/Welcome!.png")}
        />
      </View>
      <View style={styles.formContainer}>
        <AuthInputField
          label="Name"
          placeholder="John Doe"
          containerStyle={styles.marginBottom}
        />
        <AuthInputField
          label="Email"
          placeholder="john@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={styles.marginBottom}
        />
        <AuthInputField
          label="Password"
          placeholder="********"
          autoCapitalize="none"
          secureTextEntry
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 0.3,
    width: "100%",
    paddingHorizontal: 15, // padding in the x direction (left and the right)
  },
  marginBottom: {
    marginBottom: 15,
  },
});

export default SignUp;
