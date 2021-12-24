import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Image,
  Text,
  View,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import images from "../../../../assets/images";
import palette from "../../palette";
import Fonts from "../../Fonts";

interface IInput {
  placeholder?: string;
  label: string;
  isPassword?: boolean;
  boxstyle?: StyleProp<ViewStyle>;
  setValue?: (s: string) => void;
  value?: string;
  error?: any;
}

const Input = ({
  placeholder,
  label,
  isPassword,
  boxstyle,
  value,
  setValue,
  error,
  ...rest
}: IInput & TextInputProps) => {
  const [hidePassword, setHidePassword] = useState(!!isPassword);

  return (
    <>
      <View
        style={[
          styles.main,
          boxstyle,
          {
            borderColor: error ? palette.dangerRed : palette.border,
          },
        ]}
      >
        {label ? (
          <Text
            style={[
              styles.mainLabelGrey,
              { backgroundColor: palette.lightWhitebackground },
            ]}
          >
            {label}
          </Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          secureTextEntry={hidePassword}
          placeholderTextColor={palette.lightWhitebackground}
          value={value}
          onChangeText={setValue}
          {...rest}
        />
        {!isPassword && error ? <Image source={images.Caution} /> : null}
        {isPassword && (
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={23}
              style={{
                color: hidePassword ? palette.placeholder : palette.primary,
              }}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  main: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 40,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratRegular,
    marginLeft: 12,
  },
  errorMessage: {
    color: palette.dangerRed,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    marginLeft: 8,
    marginTop: 4,
  },
  mainLabelGrey: {
    position: "absolute",
    top: Platform.OS === "ios" ? -10 : -12,
    left: 25,
    fontSize: 15,
    backgroundColor: palette.lightWhitebackground,
    color: "gray",
    paddingHorizontal: 5,
    fontFamily: Fonts.MontserratRegular,
  },
});
