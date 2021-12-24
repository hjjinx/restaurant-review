import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  ColorValue,
} from "react-native";
import palette from "../../palette";

interface Props {
  color?: ColorValue;
  containerStyle?: StyleProp<ViewStyle>;
}

const OverlayLoader = ({ color, containerStyle }: Props) => {
  return (
    <View style={[styles.loadingContainer, containerStyle]}>
      <ActivityIndicator color={color || palette.white} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.modalBg,
    height: Dimensions.get("screen").height,
    width: "100%",
  },
});

export default OverlayLoader;
