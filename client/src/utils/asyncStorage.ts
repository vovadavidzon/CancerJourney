import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const getFromAsyncStorage = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const removeFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};

export const clearAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export enum Keys {
  AUTH_TOKEN = "AUTH_TOKEN",
  VIEWED_ON_BOARDING = "@viewedOnBoarding",
  UPLOAD_FOLDERS_LAYOUT = "UPLOAD_FOLDERS_LAYOUT",
  LAST_HANDLED_NOTIFICATION_ID = "NotificationId",
  USER_LANGUAGE = "USER_LANGUAGE",
  IS_RTL = "IS_RTL",
}
