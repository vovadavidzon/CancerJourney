import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

import MoreOptionsModal from "./MoreOptionsModal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export type ImageType = {
  _id: string;
  uri: string;
  title: string;
  uploadTime: string;
  description?: string;
  type: string;
  pdf_file?: string;
};

interface Props {
  item: ImageType;
  index: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number | undefined>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  numColumns: number;
  description?: string;
  folderName: string;
}

const ImageCard = React.memo(
  ({
    item,
    index,
    setSelectedImageIndex,
    setModalVisible,
    numColumns,
    folderName,
  }: Props) => {
    const [isOptionModalVisible, setOptionModalVisible] =
      useState<boolean>(false);
    const [isImageLoading, setImageIsLoading] = useState(true);

    const handleMoreOptionsPress = useCallback(() => {
      setOptionModalVisible(true);
      Vibration.vibrate(60);
    }, []);

    const iconSize = useMemo(() => (numColumns === 3 ? 24 : 30), [numColumns]);

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            setSelectedImageIndex(index);
            setModalVisible(true);
          }}
          onLongPress={handleMoreOptionsPress}
          activeOpacity={0.6}
          style={styles.cardContainer}
        >
          <View style={styles.imageContainer}>
            {isImageLoading ? (
              <View style={styles.image}>
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut.duration(500)}
                >
                  <LottieView
                    source={require("@assets/Animations/ImageLoadingAnimation.json")}
                    autoPlay
                    loop
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Animated.View>
                <Image
                  source={{ uri: item?.uri }}
                  onLoad={() => setImageIsLoading(false)} // Image loaded successfully
                  onError={() => setImageIsLoading(false)} // Image failed to load
                />
              </View>
            ) : (
              <Image source={{ uri: item?.uri }} style={styles.image} />
            )}

            <View style={[styles.textContainer]}>
              <Text
                style={[
                  styles.imageTitle,
                  { textAlign: item?.title.length > 10 ? "left" : "center" },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item?.title}
              </Text>
              <Text style={styles.imageDate}>{item?.uploadTime}</Text>
            </View>
            <TouchableOpacity
              style={styles.moreIcon}
              onPress={handleMoreOptionsPress}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={iconSize}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Custom Modal for More Options */}
        <MoreOptionsModal
          item={item}
          isOptionModalVisible={isOptionModalVisible}
          setOptionModalVisible={setOptionModalVisible}
          folderName={folderName}
        />
      </>
    );
  }
);

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 8,
    paddingBottom: 20,
    width: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  textContainer: {
    padding: 8,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  imageDate: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  moreIcon: {
    position: "absolute",
    right: 0,
    top: 5,
  },
});

export default ImageCard;
