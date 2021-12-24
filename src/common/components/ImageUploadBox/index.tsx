import React from "react";
import {
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Fonts from "../../Fonts";
import images from "../../../../assets/images";
import palette from "../../palette";

type ImageUploadBoxProps = {
  image?: any;
  setImage: (s: any) => void;
  error?: string | false | undefined;
};

const ImageUploadBox = ({ image, setImage, error }: ImageUploadBoxProps) => {
  const onSelectImage = () =>
    Alert.alert("Alert", "What would you like to do", [
      {
        text: "Remove Image",
        onPress: () => setImage(null),
      },
      { text: "Replace Image", onPress },
      { text: "Cancel", onPress: () => {} },
    ]);

  const onUploadImage = () =>
    ImagePicker.launchImageLibraryAsync({
      aspect: [16, 9],
      quality: 0.5,
      allowsEditing: true,
      base64: true,
    }).then((image) => {
      if (image && image.base64) {
        setImage(image.base64);
      }
    });

  const onCaptureImage = () =>
    ImagePicker.launchCameraAsync({
      aspect: [16, 10],
      quality: 0.5,
      allowsEditing: true,
      base64: true,
    }).then((image) => {
      if (image && image.base64) {
        setImage(image.base64);
      }
    });

  const onPress = () =>
    Alert.alert("Alert", "What would you like to do", [
      {
        text: "Upload Image",
        onPress: onUploadImage,
      },
      { text: "Capture Image", onPress: onCaptureImage },
      { text: "Cancel", onPress: () => {} },
    ]);

  return image ? (
    <TouchableOpacity
      style={[styles.container, { padding: 0 }]}
      onPress={onSelectImage}
    >
      <Image source={image} style={styles.image} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[styles.container, !!error && { borderColor: palette.dangerRed }]}
      onPress={onPress}
    >
      <View style={styles.row1}>
        <Text style={styles.mediumTextPrimary16}>{"Upload Image here"}</Text>
        <Image source={images.Caution} style={styles.idIcon} />
      </View>
      <View style={styles.row2}>
        <Text style={styles.grey14}>{"Take or upload an image of the "}</Text>
        <Text style={[styles.grey14, { marginTop: 3 }]}>{"Restaurant"}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: 150,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    height: 160,
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 25,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  row2: {
    height: 60,
    alignItems: "flex-start",
  },

  idIcon: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  mediumTextPrimary16: {
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
  },
  grey14: {
    color: "gray",
    fontSize: 14,
    fontFamily: Fonts.MontserratMedium,
  },
});

export default ImageUploadBox;
