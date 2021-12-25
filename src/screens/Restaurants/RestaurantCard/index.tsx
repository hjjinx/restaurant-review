import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import Fonts from "../../../common/Fonts";
import palette from "../../../common/palette";

type RestaurantCardProps = {
  name: string;
  address: string;
  rating: number;
  numRatings: number;
  image?: any;
};

const RestaurantCard = (props: RestaurantCardProps) => {
  const { name, address, rating, numRatings, image } = props;
  const stars = useMemo(() => Math.round(rating * 2) / 2, [rating]);
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.mediumTextPrimary16}>{name}</Text>
        <Text style={styles.darkGrayRegular12} numberOfLines={2}>
          {address}
        </Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <FontAwesome
              name={
                stars - i === -0.5
                  ? "star-half-o"
                  : stars >= i
                  ? "star"
                  : "star-o"
              }
              style={styles.star}
            />
          ))}
          <Text style={styles.rating}>{rating}</Text>
          <Text style={styles.numRatings}> ({numRatings})</Text>
        </View>
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
  rating: {
    color: palette.primary,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
  },
  numRatings: {
    color: palette.textPrimary,
    fontSize: 12,
    fontFamily: Fonts.MontserratLight,
  },
  textContainer: {
    paddingLeft: 16,
    marginRight: 8,
    flex: 1,
    justifyContent: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 3,
    color: palette.primary,
    fontSize: 12,
  },
});

export default RestaurantCard;
