import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Main from "./Main";
import PublicProfileContainer from "@components/PublicProfileContainer";
import { useSelector } from "react-redux";
import { getAuthState, getProfile } from "src/store/auth";

type Props = {
  route: any;
};

const Tab = createMaterialTopTabNavigator();

const PublicProfile: FC<Props> = ({ route }) => {
  const profile = useSelector(getProfile);

  const privateUser = {
    _id: profile?.id,
    name: profile?.name,
    avatar: { url: profile?.avatar, publicId: profile?.avatar },
    userType: profile?.userType,
  };

  const { publicUser, publicProfile } = route.params || {
    publicUser: privateUser,
    publicProfile: true,
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {publicProfile ? (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2223/2223615.png",
              }}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Public Profile </Text>
        </View>
      ) : (
        <View style={{ paddingTop: 10 }}></View>
      )}

      <View style={styles.container}>
        <PublicProfileContainer
          profile={publicUser || privateUser}
          publicProfile={publicProfile}
          currentUser={profile}
        />

        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: styles.tabBarLabelStyle,
            tabBarIndicatorStyle: styles.tabBarIndicatorStyle,
            tabBarPressColor: colors.INACTIVE_CONTRAST, // Remove ripple effect
            tabBarPressOpacity: 0.8, // Adjust the opacity as needed
          }}
        >
          <Tab.Screen
            name="Posts"
            component={Main}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={focused ? styles.tabLabelFocused : styles.tabLabel}
                >
                  Uploads
                </Text>
              ),
            }}
            initialParams={{
              publicProfile: true,
              publicUserId: publicUser?._id || privateUser._id,
              postsByReplies: false,
            }}
          />
          <Tab.Screen
            name="Replays"
            component={Main}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={focused ? styles.tabLabelFocused : styles.tabLabel}
                >
                  Replays
                </Text>
              ),
            }}
            initialParams={{
              publicProfile: true,
              publicUserId: publicUser?._id || privateUser._id,
              postsByReplies: true,
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBarStyle: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowRadius: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "none",
  },
  header: {
    padding: 12,
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  headerTitle: {
    paddingLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.ICON,
    height: 2,
    borderRadius: 10,
  },
  tabLabel: {
    color: colors.CONTRAST,
  },
  tabLabelFocused: {
    color: colors.ICON,
  },
});

export default PublicProfile;
