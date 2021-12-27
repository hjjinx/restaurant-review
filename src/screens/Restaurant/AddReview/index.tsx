import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView, Button, Header, TextArea } from "../../../common/components";
import Fonts from "../../../common/Fonts";
import palette from "../../../common/palette";
import { setAlertMessage } from "../../../redux/common";
import {
  addReview,
  getRestaurant,
  getRestaurants,
  updateReview,
} from "../../../redux/restaurants";
import { selectUser } from "../../../redux/user";

const iconName = (rating: number) => {
  switch (rating) {
    case 1:
      return "sad-cry";
    case 2:
      return "sad-tear";
    case 3:
      return "meh";
    case 4:
      return "smile";
    case 5:
      return "smile-beam";
  }
};

const AddReview = ({ navigation, route }: any) => {
  const user = useSelector(selectUser);
  const {
    restaurant,
    userRating: previousRating,
    comment: previousComment,
    id,
  } = route?.params || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(previousRating);
  const [comment, setComment] = useState(previousComment || "");
  const submit = async () => {
    try {
      setLoading(true);
      if (id) {
        await updateReview(
          restaurant?.id,
          {
            comment,
            rating,
            id,
          },
          previousRating
        );
      } else
        await addReview(restaurant?.id, {
          comment,
          createdBy: user?.uid,
          dateOfVisit: new Date(),
          rating,
        });
      dispatch(getRestaurants(0));
      dispatch(getRestaurant(restaurant?.id, user));
      dispatch(
        setAlertMessage(`Successfully ${id ? "updated" : "added"} the review!`)
      );
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      dispatch(setAlertMessage("There was an error!"));
    }
    navigation.goBack();
  };
  return (
    <AreaView noScroll>
      <Header heading={restaurant.name} canGoBack />
      <View style={styles.areaView}>
        <View style={styles.infoContainer}>
          <FontAwesome5
            name={iconName(rating)}
            size={30}
            color={palette.primary}
          />
          <View>
            <Text style={styles.userNameText}>{user.name}</Text>
            <Text style={styles.postingPublicly}>Posting publicly</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity
              key={`star-rating-${i}`}
              onPress={() => setRating(i)}
            >
              <FontAwesome
                name={rating >= i ? "star" : "star-o"}
                style={[styles.star, { fontSize: 40 }]}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginTop: 30 }}>
          <TextArea
            value={comment}
            onChangeText={setComment}
            label="Share more about your experience"
            labelStyle={{ fontSize: 14 }}
            placeholder="Share details of your own experience at this place"
            height={200}
          />
        </View>
        <Button
          text={"Submit"}
          onPress={submit}
          style={{ marginTop: 30 }}
          loading={loading}
          disabled={loading}
        />
      </View>
    </AreaView>
  );
};

const styles = StyleSheet.create({
  areaView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
    alignSelf: "center",
  },
  star: {
    marginRight: 3,
    color: palette.primary,
    fontSize: 20,
  },
  userNameText: {
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
    marginHorizontal: 13,
  },
  postingPublicly: {
    color: palette.textPrimary,
    fontSize: 12,
    fontFamily: Fonts.MontserratLight,
    marginHorizontal: 13,
  },
  infoContainer: {
    flexDirection: "row",
    paddingBottom: 10,
    alignItems: "center",
  },
});

export default AddReview;
