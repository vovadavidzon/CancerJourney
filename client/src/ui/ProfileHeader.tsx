import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Avatar from "./Avatar";
import colors from "@utils/colors";
import { UserProfile } from "src/store/auth";

interface Props {
  profile: UserProfile | null;
  toggleModalVisible: () => void;
}

const ProfileHeader: FC<Props> = ({ profile, toggleModalVisible }) => {
  let formattedDate = "";
  if (profile?.createdAt) {
    // Check if `createdAt` is defined
    const date = new Date(profile.createdAt);

    // Format the date
    formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <View style={styles.profileHeader}>
      <Avatar onButtonPress={toggleModalVisible} uri={profile?.avatar || ""} />
      <Text style={styles.profileName}>{profile?.name}</Text>
      <View style={styles.row}>
        <Text style={styles.profileEmail}>{profile?.email}</Text>
        {profile?.verified ? (
          <MaterialCommunityIcons
            name="check-decagram"
            size={24}
            color={colors.LIGHT_BLUE}
            style={styles.verifiedIcon}
          />
        ) : null}
      </View>
      <Text style={styles.activeSince}>Active since - {formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 1,
  },
  activeSince: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
  },
  verifiedIcon: {
    paddingLeft: 5,
  },
});

export default ProfileHeader;
