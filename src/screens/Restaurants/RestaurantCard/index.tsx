import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import Fonts from "../../../common/Fonts";
import palette from "../../../common/palette";

type RestaurantCardProps = {
  name: string;
  address: string;
  rating: number;
  onPress?: () => void;
  image?: any;
};

const RestaurantCard = (props: RestaurantCardProps) => {
  const { name, address, rating, onPress, image } = props;
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.mediumTextPrimary16}>{name}</Text>
        <Text style={styles.darkGrayRegular12} numberOfLines={2}>
          {address}
        </Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.primaryRegular12}>{rating}</Text>
        </TouchableOpacity>
      </View>
      <Image source={image} style={styles.image} resizeMode="stretch" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: palette.white,
    borderRadius: 15,
    height: 100,
  },
  image: {
    height: 100,
    borderRadius: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    width: "40%",
  },
  darkGrayRegular12: {
    color: palette.textPrimary,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    marginTop: 8,
    marginBottom: 5,
  },
  mediumTextPrimary16: {
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
  },
  primaryRegular12: {
    color: palette.primary,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
  },
  textContainer: {
    paddingLeft: 16,
    marginRight: 8,
    flex: 1,
    justifyContent: "center",
  },
});

export default RestaurantCard;
