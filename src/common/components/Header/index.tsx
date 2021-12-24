import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import palette from "../../palette";
import Fonts from "../../Fonts";
import { useNavigation } from "@react-navigation/native";

type HeaderProps = {
  canGoBack?: boolean;
  heading: string;
};

const Header = (props: HeaderProps) => {
  const { canGoBack, heading } = props;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            height: "100%",
            justifyContent: "center",
            width: 50,
          }}
        >
          <AntDesign name="arrowleft" style={styles.leftArrowIcon} />
        </TouchableOpacity>
      )}
      <Text style={[styles.heading, canGoBack && { marginLeft: -70 }]}>
        {heading}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    paddingLeft: 20,
    backgroundColor: palette.primary,
    elevation: 5,
    alignItems: "center",
    flexDirection: "row",
  },
  leftArrowIcon: {
    fontSize: 20,
    color: palette.white,
  },
  heading: {
    flex: 1,
    color: palette.white,
    fontSize: 18,
    fontFamily: Fonts.MontserratMedium,
    textAlign: "center",
  },
});

export default Header;
