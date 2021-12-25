import React from "react";
import { StyleSheet, View, Text } from "react-native";
import moment from "moment";
import Fonts from "../../../common/Fonts";
import palette from "../../../common/palette";
import { FontAwesome5 } from "@expo/vector-icons";
import { ratingColor } from "../../../common/utils";

type ReviewCardProps = {
  userName: string;
  date: Date | string;
  rating: string;
  comment: string;
};

const ReviewCard = ({ userName, date, rating, comment }: ReviewCardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="user-check" size={24} color={palette.primary} />
        </View>
        <View style={styles.topRight}>
          <Text style={styles.userNameText}>{userName}</Text>
          <View
            style={[
              styles.ratingBox,
              { backgroundColor: ratingColor(Number(rating)) },
            ]}
          >
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.commentView}>
        <Text style={styles.commentText}>{comment}</Text>
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.datetimeView}>
          <Text
            style={[styles.primaryRegular14, { color: palette.placeholder }]}
          >
            {moment(date).format("LL")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    borderRadius: 20,
    borderColor: palette.border,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 10,
    marginTop: 15,
    backgroundColor: palette.white,

    shadowColor: palette.black,
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 0 },
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  topRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  datetimeView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  commentView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  ratingBox: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: palette.primary,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  userNameText: {
    flex: 1,
    fontSize: 16,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
    marginHorizontal: 16,
  },
  commentText: {
    fontSize: 14,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratRegular,
  },
  primaryRegular14: {
    color: palette.primary,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
  },
  ratingText: {
    color: palette.white,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
  },
});