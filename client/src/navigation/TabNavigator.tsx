import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";

import Profile from "@views/bottomTab/Profile";
import CustomPostButton from "@ui/bottomTab/CustomPostButton";
import AnimatedIcon from "@ui/bottomTab/AnimatedIcon";
import Settings from "@views/bottomTab/Settings";
import UploadFileNavigator from "./UploadFileNavigator";
import Home from "@views/bottomTab/Home";
import SocialNavigator from "./SocialNavigator";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon label="Home" icon="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          headerShown: true,
          title: "Personal Profile",
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Profile"
              icon="user"
              size={size}
              color={color}
            />
          ),
          headerStyle: {
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 2 }, // Shadow offset
            shadowOpacity: 0.1, // Shadow opacity
            shadowRadius: 3.84, // Shadow radius
            elevation: 5, // Elevation for Android
          },
        }}
      />
      <Tab.Screen
        name="PostScreen"
        component={SocialNavigator}
        options={{
          tabBarIcon: (props) => {
            return (
              <Image
                source={require("@assets/Icons/icon-color.png")}
                resizeMode="contain"
                style={{ width: 70, height: 70 }}
              />
            );
          },

          tabBarButton: (props) => <CustomPostButton {...props} />,
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={UploadFileNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Upload"
              icon="upload"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={Settings}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Settings"
              icon="settings"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "white",
    position: "absolute",
    bottom: 5,
    left: 5,
    right: 5,
    borderRadius: 15,
    height: 80,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default TabNavigator;
