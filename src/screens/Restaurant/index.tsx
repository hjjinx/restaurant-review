import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from "react-native";
import { OverlayLoader } from "../../common/components";
import Fonts from "../../common/Fonts";
import palette from "../../common/palette";
import { roundRating } from "../../common/utils";
import { getRestaurant } from "../../redux/restaurants";
import ReviewCard from "./ReviewCard";

const RestaurantDetail = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<any>();
  const _getRestaurant = async (restaurantId: string) => {
    try {
      setLoading(true);
      const data = await getRestaurant(restaurantId);
      setRestaurant(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    const restaurantId = route?.params?.restaurantId;
    _getRestaurant(restaurantId);
  }, []);
  const highestRatedReview = restaurant?.highestRatedReview;
  const lowestRatedReview = restaurant?.lowestRatedReview;
  const latestRatedReview = restaurant?.latestRatedReview;
  return (
    <SafeAreaView style={styles.areaView}>
      {loading ? (
        <OverlayLoader
          color={palette.primary}
          containerStyle={{ backgroundColor: palette.white }}
        />
      ) : (
        <>
          <ScrollView>
            <ImageBackground
              style={{ width: "100%", height: 260 }}
              resizeMode="cover"
              source={{ uri: restaurant?.imageUri }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backIconContainer}
              >
                <AntDesign name="arrowleft" style={styles.chevronIcon} />
              </TouchableOpacity>
            </ImageBackground>
            <View style={styles.box}>
              <Text style={styles.title}>{restaurant?.name}</Text>
              <Text style={styles.address}>{restaurant?.address}</Text>
              <View style={styles.reviewSummaryContainer}>
                <Text style={styles.reviewSummaryText}>Review Summary</Text>
                <View style={{ marginTop: 10 }}>
                  <Text style={styles.ratingCategoryText}>
                    Overall Average Rating
                  </Text>
                  <View style={styles.avgRatingContainer}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <FontAwesome
                        name={
                          Number(roundRating(restaurant?.avgRating, 2)) - i ===
                          -0.5
                            ? "star-half-o"
                            : Number(roundRating(restaurant?.avgRating, 2)) >= i
                            ? "star"
                            : "star-o"
                        }
                        style={styles.star}
                      />
                    ))}

                    <Text style={styles.rating}>
                      {roundRating(restaurant?.avgRating, 10)}
                    </Text>
                  </View>
                  <Text style={styles.numRatings}>
                    Based on {restaurant?.numRatings} Review(s)
                  </Text>
                </View>
              </View>
              <View style={styles.reviewSummaryContainer}>
                <Text style={styles.reviewSummaryText}>
                  Highest Rated Review
                </Text>
                <ReviewCard
                  userName={highestRatedReview?.createdBy}
                  date={
                    new Date(highestRatedReview?.dateOfVisit?.seconds * 1000)
                  }
                  rating={roundRating(highestRatedReview?.rating)}
                  comment={highestRatedReview?.comment}
                />
              </View>
              <View style={styles.reviewSummaryContainer}>
                <Text style={styles.reviewSummaryText}>
                  Lowest Rated Review
                </Text>
                <ReviewCard
                  userName={lowestRatedReview?.createdBy}
                  date={
                    new Date(lowestRatedReview?.dateOfVisit?.seconds * 1000)
                  }
                  rating={roundRating(lowestRatedReview?.rating)}
                  comment={lowestRatedReview?.comment}
                />
              </View>
              <View style={styles.reviewSummaryContainer}>
                <Text style={styles.reviewSummaryText}>Latest Review</Text>
                <ReviewCard
                  userName={latestRatedReview?.createdBy}
                  date={
                    new Date(latestRatedReview?.dateOfVisit?.seconds * 1000)
                  }
                  rating={roundRating(latestRatedReview?.rating)}
                  comment={latestRatedReview?.comment}
                />
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default RestaurantDetail;

const styles = StyleSheet.create({
  areaView: {
    backgroundColor: palette.lightWhitebackground,
    flex: 1,
  },
  box: {
    backgroundColor: palette.lightWhitebackground,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    paddingHorizontal: 20,
    marginTop: -50,
    marginBottom: 20,
  },
  backIconContainer: {
    marginLeft: 15,
    marginTop: 16,
    zIndex: 1,
    backgroundColor: palette.primary,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    fontSize: 25,
    color: palette.white,
  },
  title: {
    fontSize: 20,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
    paddingVertical: 16,
  },
  address: {
    color: "gray",
    fontSize: 15,
    fontFamily: Fonts.MontserratRegular,
    lineHeight: 24,
  },
  reviewSummaryContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderColor: palette.border,
  },
  reviewSummaryText: {
    color: palette.textPrimary,
    fontSize: 17,
    fontFamily: Fonts.MontserratMedium,
    lineHeight: 24,
  },
  ratingCategoryText: {
    color: palette.textPrimary,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    lineHeight: 24,
  },
  avgRatingContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  rating: {
    color: palette.primary,
    fontSize: 18,
    fontFamily: Fonts.MontserratRegular,
  },
  numRatings: {
    color: palette.textPrimary,
    fontSize: 14,
    fontFamily: Fonts.MontserratLight,
    marginTop: 2,
  },
  star: {
    marginRight: 3,
    color: palette.primary,
    fontSize: 20,
  },
});
