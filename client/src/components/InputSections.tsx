import { Picker } from "@react-native-picker/picker";
import { FC, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import CustomPicker from "./CustomPicker";
import InputRowContainer from "@ui/InputRowContainer";

export interface NewProfile {
  userType: string;
  diagnosisDate: string;
  cancerType: string;
  subtype: string;
  stage: string;
  name: string;
  email: string;
  activeSince: string;
  gender: string;
  birthDate: string;
  country: string;
}

interface CancerTypeRibbon {
  [key: string]: number; // Use `number` since `require()` returns a number for local assets
}

const cancerTypeRibbon: CancerTypeRibbon = {
  bone: require("@assets/CancerType/bone-cancer.png"),
  breast: require("@assets/CancerType/breast-cancer.png"),
  lung: require("@assets/CancerType/lung-cancer.png"),
  appendix: require("@assets/CancerType/appendix-cancer.png"),
  brain: require("@assets/CancerType/brain-cancer.png"),
  bladder: require("@assets/CancerType/bladder-cancer.png"),
  blood: require("@assets/CancerType/blood-cancer.png"),
  kidney: require("@assets/CancerType/kidney-cancer.png"),
  childhood: require("@assets/CancerType/childhood-cancer.png"),
  colorectal: require("@assets/CancerType/colorectal-cancer.png"),
  "gallbladder-and-bile-duct": require("@assets/CancerType/gallbladder-and-bile-duct-cancer.png"),
  gastric: require("@assets/CancerType/gastric-cancer.png"),
  gynecological: require("@assets/CancerType/gynecological-cancer.png"),
  "head-and-neck": require("@assets/CancerType/head-and-neck-cancer.png"),
  liver: require("@assets/CancerType/liver-cancer.png"),
  pancreatic: require("@assets/CancerType/pancreatic-cancer.png"),
  prostate: require("@assets/CancerType/prostate-cancer.png"),
  skin: require("@assets/CancerType/skin-cancer.png"),
  testicular: require("@assets/CancerType/testicular-cancer.png"),
  thyroid: require("@assets/CancerType/thyroid-cancer.png"),
};

interface Props {
  newProfile: NewProfile;
  setNewProfile: (profile: NewProfile) => void;
}

const InputSections: FC<Props> = ({ newProfile, setNewProfile }) => {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <>
      <InputRowContainer
        title={"Name"}
        children={
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, name: text })
            }
            value={newProfile.name}
            placeholder="Enter your name"
          />
        }
      />

      <InputRowContainer
        title={"Gender"}
        children={
          <Picker
            selectedValue={newProfile.gender}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, gender: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Birth Date"}
        children={
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, birthDate: text })
            }
            value={newProfile.birthDate}
            placeholder="DD/MM/YYYY"
          />
        }
      />

      <InputRowContainer
        title={"Diagnosis Date"}
        children={
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, diagnosisDate: text })
            }
            value={newProfile.diagnosisDate}
            placeholder="DD/MM/YYYY"
          />
        }
      />

      <InputRowContainer
        title={"User Type"}
        children={
          <Picker
            selectedValue={newProfile.userType}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, userType: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="Fighter (Patient)" value="patient" />
            <Picker.Item label="Family member" value="family" />
            <Picker.Item label="Supporter (Friend)" value="friend" />
            <Picker.Item label="Health care pro" value="professional" />
            <Picker.Item label="Caregiver" value="caregiver" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Cancer Type"}
        children={
          <>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={[styles.rowInput, { paddingVertical: 15 }]}
            >
              <Text
                style={styles.buttonText}
                numberOfLines={1} // Ensure text is on one line
                ellipsizeMode="tail" // Add ellipsis at the end if text is too long
              >
                {newProfile.cancerType.charAt(0).toUpperCase() +
                  newProfile.cancerType.slice(1) +
                  " Cancer"}
              </Text>
              <Image
                source={
                  cancerTypeRibbon[newProfile.cancerType] ||
                  require("@assets/CancerType/breast-cancer.png")
                }
                style={{ width: 25, height: 25, marginRight: 5 }}
              />
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color="gray"
                style={{ paddingRight: 6 }}
              />
            </TouchableOpacity>
            <CustomPicker
              visible={pickerVisible}
              setNewProfile={setNewProfile}
              setPickerVisible={setPickerVisible}
              newProfile={newProfile}
            />
          </>
        }
      />

      <InputRowContainer
        title={"Cancer Stage"}
        children={
          <Picker
            selectedValue={newProfile.stage}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, stage: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="No stage" value="no" />
            <Picker.Item label="Stage 0" value="0" />
            <Picker.Item label="Stage 1" value="1" />
            <Picker.Item label="Stage 2" value="2" />
            <Picker.Item label="Stage 3" value="3" />
            <Picker.Item label="Stage 4" value="4" />
            <Picker.Item label="I don't know" value="" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Country"}
        children={
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, country: text })
            }
            value={newProfile.country}
            placeholder="Enter your Country"
          />
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  rowInput: {
    flex: 2, // Take up 2/3 of the space
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 5,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    overflow: "hidden", // This is necessary for iOS to clip the shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // This is for Android
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  buttonText: {
    width: "70%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
});

export default InputSections;