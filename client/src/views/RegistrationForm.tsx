import { FC, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import InputSections, { NewProfile } from "@components/InputSections";
import AppButton from "@ui/AppButton";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";
import { updateProfile } from "src/store/auth";

interface Props {}

const RegistrationForm: FC<Props> = (props) => {
  const { t } = useTranslation();
  const [newProfile, setNewProfile] = useState<NewProfile>({
    gender: "Male",
    birthDate: null,
    userType: "patient",
    cancerType: "other",
    diagnosisDate: null,
    stage: "",
    country: { cca2: "", name: "", flag: "" },
  });

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoadingUpdate(true);
    try {
      const client = await getClient();

      const { data } = await client.post("/auth/update-profile", newProfile);

      ToastNotification({
        message: t("profileUpdated"),
      });
      dispatch(updateProfile(data.profile));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      <Animated.Text
        entering={FadeInRight.duration(1000)}
        style={styles.header}
      >
        {t("registration")}
      </Animated.Text>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 8,
          padding: 8,
        }}
      >
        <InputSections
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          Registration={true}
        />
      </ScrollView>

      <Animated.View
        entering={FadeInDown.delay(200).duration(1000).springify()}
        style={styles.button}
      >
        <AppButton
          title={t("register")}
          pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
          defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
          onPress={handleSubmit}
          icon={
            <Feather
              name="check-square"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          busy={loadingUpdate}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
});

export default RegistrationForm;
