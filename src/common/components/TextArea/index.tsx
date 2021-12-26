import React from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleProp,
  TextStyle,
} from "react-native";
import Fonts from "../../Fonts";
import palette from "../../palette";

interface ITextArea {
  placeholder?: string;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  height?: number;
  error?: string | false | undefined;
}

const TextArea = ({
  placeholder,
  label,
  labelStyle,
  height,
  error,
  ...rest
}: ITextArea & TextInputProps) => {
  return (
    <>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View
        style={[
          styles.main,
          height ? { height } : null,
          !!error && { borderColor: palette.dangerRed },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={palette.placeholder}
          multiline
          {...rest}
        />
      </View>
      {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 100,
    width: "100%",
    borderWidth: 1,
    flexDirection: "row",
    borderColor: palette.border,
    borderRadius: 24,
    paddingHorizontal: 8,
  },
  input: {
    textAlignVertical: "top",
    marginVertical: 10,
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratRegular,
    marginLeft: 12,
  },
  label: {
    color: "gray",
    marginBottom: 5,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
  },
  errorMessage: {
    color: palette.dangerRed,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    marginLeft: 8,
    marginTop: 4,
  },
});

export default TextArea;
