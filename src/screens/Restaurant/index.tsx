import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { OverlayLoader } from "../../common/components";
import Fonts from "../../common/Fonts";
import palette from "../../common/palette";
import { roundRating } from "../../common/utils";
import { setAlertMessage } from "../../redux/common";
import {
  deleteRestaurant,
  deleteReview,
  getRestaurant,
  getRestaurants,
  selectIsFetchingSelectedRestaurant,
  selectSelectedRestaurant,
} from "../../redux/restaurants";
import { selectUser } from "../../redux/user";
import ReviewCard from "./ReviewCard";

const RestaurantDetail = ({ navigation, route }: any) => {
  const restaurantId = route?.params?.restaurantId;
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const restaurant = useSelector(selectSelectedRestaurant);
  const fetchingRestaurant = useSelector(selectIsFetchingSelectedRestaurant);
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const _getRestaurant = (restaurantId: string) =>
    dispatch(getRestaurant(restaurantId, user));

  useEffect(() => {
    _getRestaurant(restaurantId);
  }, []);

  const reviewListMap = useMemo(() => {
    const arr = [];
    if (restaurant?.loggedInUserReview)
      arr.push({
        title: "Your Review",
        data: restaurant?.loggedInUserReview,
      });
    if (restaurant?.highestRatedReview)
      arr.push({
        title: "Highest Rated Review",
        data: restaurant?.highestRatedReview,
      });
    if (restaurant?.lowestRatedReview)
      arr.push({
        title: "Lowest Rated Review",
        data: restaurant?.lowestRatedReview,
      });
    if (restaurant?.latestRatedReview)
      arr.push({
        title: "Latest Review",
        data: restaurant?.latestRatedReview,
      });
    return arr;
  }, [restaurant]);

  const onDeleteReview = (review: any) => {
    Alert.alert("Delete", "Are you sure you want to delete this review?", [
      {
        text: "Yes",
        onPress: () => {
          setLoading(true);
          deleteReview(restaurant, review, () => {
            dispatch(setAlertMessage("Review Deleted Successfully!"));
            _getRestaurant(restaurantId);
            dispatch(getRestaurants(false));
          });
        },
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const onEditReview = (review: any) => {
    navigation.navigate("AddReview", {
      restaurant,
      userRating: review.rating,
      comment: review.comment,
      id: review.id,
    });
  };

  const onDeleteRestaurant = () => {
    Alert.alert("Delete", "Are you sure you want to delete this restaurant?", [
      {
        text: "Yes",
        onPress: async () => {
          setLoading(true);
          await deleteRestaurant(restaurant?.id);
          dispatch(setAlertMessage("Restaurant Deleted Successfully!"));
          dispatch(getRestaurants(false));
          navigation.goBack();
        },
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  const onEditRestaurant = () =>
    navigation.navigate("AddRestaurant", {
      restaurant,
    });

  return (
    <SafeAreaView style={styles.areaView}>
      {loading || fetchingRestaurant ? (
        <OverlayLoader
          color={palette.primary}
          containerStyle={{ backgroundColor: palette.white }}
        />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageBackground
              style={styles.imageContainer}
              resizeMode="cover"
              source={{ uri: restaurant?.imageUri }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backIconContainer}
              >
                <AntDesign name="arrowleft" style={styles.chevronIcon} />
              </TouchableOpacity>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={onEditRestaurant}
                  style={[
                    styles.backIconContainer,
                    { backgroundColor: "#FFBD35" },
                  ]}
                >
                  <MaterialIcons name="edit" style={styles.chevronIcon} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onDeleteRestaurant}
                  style={[
                    styles.backIconContainer,
                    { backgroundColor: palette.dangerRed, marginRight: 15 },
                  ]}
                >
                  <MaterialIcons name="delete" style={styles.chevronIcon} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
            <View style={styles.box}>
              <Text style={styles.title}>{restaurant?.name}</Text>
              <Text style={styles.address}>{restaurant?.address}</Text>
              <View style={styles.reviewSummaryContainer}>
                <Text style={styles.reviewSummaryText}>Review Summary</Text>
                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() =>
                    navigation.navigate("ReviewsList", { restaurant })
                  }
                >
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
                        key={`star-rating-${i}`}
                      />
                    ))}

                    <Text style={styles.rating}>
                      {roundRating(restaurant?.avgRating, 10)}
                    </Text>
                  </View>
                  <Text style={styles.numRatings}>
                    Based on {restaurant?.numRatings} Review(s)
                  </Text>
                </TouchableOpacity>
              </View>
              {!restaurant?.loggedInUserReview && (
                <View style={styles.reviewSummaryContainer}>
                  <Text style={styles.reviewSummaryText}>
                    {"Add a review!"}
                  </Text>
                  <Text style={styles.ratingCategoryText}>
                    Adding a review helps other people
                  </Text>
                  <View style={styles.userReviewContainer}>
                    <AntDesign
                      name="addusergroup"
                      color={palette.primary}
                      style={{ fontSize: 25, marginRight: 20 }}
                    />
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TouchableOpacity
                        key={`star-rating-${i}`}
                        onPress={() => {
                          setUserRating(i);
                          setTimeout(() => {
                            navigation.navigate("AddReview", {
                              restaurant,
                              userRating: i,
                            });
                          }, 200);
                        }}
                      >
                        <FontAwesome
                          name={userRating >= i ? "star" : "star-o"}
                          style={[styles.star, { fontSize: 30 }]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              {reviewListMap.map((i, index) => (
                <View
                  style={styles.reviewSummaryContainer}
                  key={`review-${index}`}
                >
                  <Text style={styles.reviewSummaryText}>{i.title}</Text>
                  <ReviewCard
                    userName={
                      user?.uid == i.data?.createdBy?.uid
                        ? "You"
                        : i.data?.createdBy?.name
                    }
                    date={new Date(i.data?.dateOfVisit?.seconds * 1000)}
                    rating={roundRating(i.data?.rating)}
                    comment={i.data?.comment}
                    editable={user?.uid == i.data?.createdBy?.uid}
                    deletable={
                      user?.isAdmin || user?.uid == i.data?.createdBy?.uid
                    }
                    onPressDelete={() => onDeleteReview(i.data)}
                    onPressEdit={() => onEditReview(i.data)}
                  />
                </View>
              ))}
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
  imageContainer: {
    width: "100%",
    height: 260,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: palette.primary,
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
  userReviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
