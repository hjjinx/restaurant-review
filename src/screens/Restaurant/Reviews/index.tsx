import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView, Header } from "../../../common/components";
import palette from "../../../common/palette";
import { roundRating } from "../../../common/utils";
import { setAlertMessage } from "../../../redux/common";
import {
  deleteReview,
  getRestaurant,
  getRestaurants,
} from "../../../redux/restaurants";
import {
  getReviewList,
  selectIsFetchingMoreReviews,
  selectIsFetchingReviewList,
  selectIsReviewListEndReached,
  selectLastReviewSnapshot,
  selectReviewList,
} from "../../../redux/reviews";
import { selectUser } from "../../../redux/user";
import ReviewCard from "../ReviewCard";

const Reviews = ({ navigation, route }: any) => {
  const { restaurant } = route?.params || {};
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const reviewList = useSelector(selectReviewList);
  const lastReviewSnapshot = useSelector(selectLastReviewSnapshot);
  const loading = useSelector(selectIsFetchingReviewList);
  const isFetchingMore = useSelector(selectIsFetchingMoreReviews);
  const isEndReached = useSelector(selectIsReviewListEndReached);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getReviewList(restaurant?.id, false));
  }, []);

  const onDeleteReview = (review: any) => {
    Alert.alert("Delete", "Are you sure you want to delete this review?", [
      {
        text: "Yes",
        onPress: () => {
          setDeleteLoading(true);
          deleteReview(restaurant, review, () => {
            dispatch(setAlertMessage("Review Deleted Successfully!"));
            setDeleteLoading(false);
            dispatch(getReviewList(restaurant?.id, false));
            dispatch(getRestaurant(restaurant?.id, user));
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
  return (
    <AreaView noScroll>
      <Header heading={restaurant.name} canGoBack />
      {loading || deleteLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
        >
          <ActivityIndicator color={palette.primary} size="large" />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={reviewList}
            renderItem={({ item }) => (
              <ReviewCard
                userName={
                  user?.uid == item.createdBy?.uid
                    ? "You"
                    : item.createdBy?.name
                }
                date={new Date(item.dateOfVisit?.seconds * 1000)}
                rating={roundRating(item.rating)}
                comment={item.comment}
                editable={user?.uid == item.createdBy?.uid}
                deletable={user?.isAdmin || user?.uid == item.createdBy?.uid}
                onPressDelete={() => onDeleteReview(item)}
                onPressEdit={() => onEditReview(item)}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => dispatch(getReviewList(restaurant?.id, false))}
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={() =>
              !isFetchingMore &&
              !isEndReached &&
              dispatch(getReviewList(restaurant?.id, lastReviewSnapshot))
            }
            ListFooterComponent={
              isFetchingMore && (
                <View style={{ padding: 10 }}>
                  <ActivityIndicator color={palette.primary} size="small" />
                </View>
              )
            }
          />
        </View>
      )}
    </AreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
});

export default Reviews;
