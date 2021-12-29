import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
  where,
  deleteDoc,
  runTransaction,
  updateDoc,
  startAfter,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { roundRating } from "../common/utils";

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurantList: [],
    fetchingRestaurantList: false,
    fetchingSelectedRestaurant: false,
    selectedRestaurant: {},
    lastRestaurantSnapshot: null,
    isFetchingMoreRestaurants: false,
    restaurantListEndReached: false,
  },
  reducers: {
    setRestaurantListRequest: (state, action) => {
      if (action.payload.isFetchingMore) state.isFetchingMoreRestaurants = true;
      else state.fetchingRestaurantList = true;
    },
    setRestaurantListSuccess: (state, action) => {
      state.lastRestaurantSnapshot = action.payload.lastRestaurantSnapshot;
      state.isFetchingMoreRestaurants = false;
      state.fetchingRestaurantList = false;
      state.restaurantListEndReached = false;
      if (action.payload.isFetchingMore) {
        state.restaurantList = [
          ...state.restaurantList,
          ...action.payload.data,
        ] as any;
      } else {
        state.restaurantList = action.payload.data;
      }
    },
    setRestaurantListError: (state) => {
      state.fetchingRestaurantList = false;
      state.isFetchingMoreRestaurants = false;
    },

    setSelectedRestaurantRequest: (state) => {
      state.fetchingSelectedRestaurant = true;
    },
    setSelectedRestaurantSuccess: (state, action) => {
      state.selectedRestaurant = action.payload;
      state.fetchingSelectedRestaurant = false;
    },
    setSelectedRestaurantError: (state) => {
      state.fetchingSelectedRestaurant = false;
    },

    setRestaurantListEndReached: (state, action) => {
      state.restaurantListEndReached = action.payload;
      state.fetchingRestaurantList = false;
      state.isFetchingMoreRestaurants = false;
    },
  },
});

export const {
  setRestaurantListRequest,
  setRestaurantListSuccess,
  setRestaurantListError,
  setSelectedRestaurantRequest,
  setSelectedRestaurantSuccess,
  setSelectedRestaurantError,
  setRestaurantListEndReached,
} = restaurantsSlice.actions;

export const getRestaurants =
  (lastRestaurantSnapshot: any = false, count: number = 10) =>
  async (dispatch: any) => {
    try {
      dispatch(
        setRestaurantListRequest({ isFetchingMore: !!lastRestaurantSnapshot })
      );
      let q;
      if (lastRestaurantSnapshot)
        q = query(
          collection(firestore, "restaurants"),
          orderBy("avgRating", "desc"),
          orderBy("numRatings", "desc"),
          startAfter(lastRestaurantSnapshot),
          limit(count)
        );
      else
        q = query(
          collection(firestore, "restaurants"),
          orderBy("avgRating", "desc"),
          orderBy("numRatings", "desc"),
          limit(count)
        );
      const querySnapshot = await getDocs(q);
      const data = [];
      if (querySnapshot.empty) {
        dispatch(setRestaurantListEndReached(true));
        return;
      }
      for (let doc of querySnapshot.docs) {
        let uri;
        try {
          uri = await getDownloadURL(
            ref(storage, `restaurantImages/${doc.id}`)
          );
        } catch (err) {
          uri = null;
        }
        data.push({ ...doc.data(), id: doc.id, imageUri: uri });
      }
      dispatch(
        setRestaurantListSuccess({
          data,
          lastRestaurantSnapshot:
            querySnapshot.docs[querySnapshot.docs.length - 1],
          isFetchingMore: !!lastRestaurantSnapshot,
        })
      );
    } catch (error) {
      console.log({ error });
      dispatch(setRestaurantListError());
    }
  };

export const getRestaurant =
  (restaurantId: string, user: any) => async (dispatch: any) => {
    try {
      dispatch(setSelectedRestaurantRequest());
      const restaurantData = await getDoc(
        doc(firestore, `restaurants/${restaurantId}`)
      );
      let uri;
      try {
        uri = await getDownloadURL(
          ref(storage, `restaurantImages/${restaurantId}`)
        );
      } catch (err) {
        uri = null;
      }
      let [
        highestRatedReview,
        lowestRatedReview,
        latestRatedReview,
        loggedInUserReview,
      ] = await Promise.all([
        new Promise(async (resolve, reject) => {
          const highestRatedReviewSnapshot = await getDocs(
            query(
              collection(firestore, `restaurants/${restaurantId}/reviews`),
              orderBy("rating", "desc"),
              limit(1)
            )
          );
          let highestRatedReview;
          if (!highestRatedReviewSnapshot.empty) {
            highestRatedReview =
              highestRatedReviewSnapshot?.docs?.[0]?.data() || {};
            const user = await getDoc(
              doc(firestore, `users/${highestRatedReview.createdBy}`)
            );
            if (user.exists())
              highestRatedReview.createdBy = { ...user?.data(), uid: user.id };
            else highestRatedReview.createdBy = { name: "Anonymous", uid: 0 };
            highestRatedReview.id = highestRatedReviewSnapshot?.docs?.[0]?.id;
          }
          resolve(highestRatedReview);
        }),
        new Promise(async (resolve, reject) => {
          const lowestRatedReviewSnapshot = await getDocs(
            query(
              collection(firestore, `restaurants/${restaurantId}/reviews`),
              orderBy("rating", "asc"),
              limit(1)
            )
          );
          let lowestRatedReview;
          if (!lowestRatedReviewSnapshot.empty) {
            lowestRatedReview =
              lowestRatedReviewSnapshot?.docs?.[0]?.data() || {};
            const user = await getDoc(
              doc(firestore, `users/${lowestRatedReview.createdBy}`)
            );
            if (user.exists())
              lowestRatedReview.createdBy = { ...user?.data(), uid: user.id };
            else lowestRatedReview.createdBy = { name: "Anonymous", uid: 0 };
            lowestRatedReview.id = lowestRatedReviewSnapshot?.docs?.[0]?.id;
          }
          resolve(lowestRatedReview);
        }),
        new Promise(async (resolve, reject) => {
          const latestRatedReviewSnapshot = await getDocs(
            query(
              collection(firestore, `restaurants/${restaurantId}/reviews`),
              orderBy("dateOfVisit", "desc"),
              limit(1)
            )
          );
          let latestRatedReview;
          if (!latestRatedReviewSnapshot.empty) {
            latestRatedReview =
              latestRatedReviewSnapshot?.docs?.[0]?.data() || {};
            const user = await getDoc(
              doc(firestore, `users/${latestRatedReview.createdBy}`)
            );
            if (user.exists())
              latestRatedReview.createdBy = { ...user?.data(), uid: user.id };
            else latestRatedReview.createdBy = { name: "Anonymous", uid: 0 };
            latestRatedReview.id = latestRatedReviewSnapshot?.docs?.[0]?.id;
          }
          resolve(latestRatedReview);
        }),
        new Promise(async (resolve, reject) => {
          if (user?.uid) {
            const loggedInUserReviewSnapshot = await getDocs(
              query(
                collection(firestore, `restaurants/${restaurantId}/reviews`),
                where("createdBy", "==", user.uid)
              )
            );
            let loggedInUserReview;
            if (!loggedInUserReviewSnapshot.empty) {
              loggedInUserReview =
                loggedInUserReviewSnapshot?.docs?.[0]?.data() || {};
              loggedInUserReview.createdBy = user;
              loggedInUserReview.id = loggedInUserReviewSnapshot?.docs?.[0]?.id;
            }
            resolve(loggedInUserReview);
          }
        }),
      ]);

      if (restaurantData.exists()) {
        dispatch(
          setSelectedRestaurantSuccess({
            ...restaurantData.data(),
            id: restaurantData.id,
            imageUri: uri,
            highestRatedReview,
            lowestRatedReview,
            latestRatedReview,
            loggedInUserReview,
          })
        );
      }
    } catch (err) {
      console.log({ err });
      dispatch(setSelectedRestaurantError());
    }
  };

export const deleteReview = async (
  restaurant: any,
  review: any,
  afterDelete: (restaurantId: string) => void
) => {
  try {
    const restaurantId = restaurant?.id;
    await deleteDoc(
      doc(firestore, `restaurants/${restaurantId}/reviews/${review.id}`)
    );
    await updateDoc(doc(firestore, `restaurants/${restaurantId}`), {
      numRatings: restaurant.numRatings - 1,
      avgRating:
        restaurant.numRatings > 1
          ? roundRating(
              (restaurant?.avgRating * restaurant.numRatings - review.rating) /
                (restaurant.numRatings - 1)
            )
          : 0,
    });
    afterDelete(restaurantId);
  } catch (err) {
    console.log({ err });
  }
};

export const addReview = async (restaurantId: string, review: any) => {
  const restaurantRef = doc(firestore, `restaurants/${restaurantId}`);
  const reviewRef = doc(
    collection(firestore, `restaurants/${restaurantId}/reviews`)
  );

  return runTransaction(firestore, async (transaction) => {
    return transaction.get(restaurantRef).then((res) => {
      if (!res.exists) {
        throw "Document does not exist!";
      }

      var newNumRatings = Number(res.data()!.numRatings) + 1;
      var oldRatingTotal = res.data()!.avgRating * res.data()!.numRatings;
      var newAvgRating = (oldRatingTotal + review.rating) / newNumRatings;

      transaction.update(restaurantRef, {
        numRatings: newNumRatings,
        avgRating: newAvgRating,
      });
      transaction.set(reviewRef, review);
    });
  });
};

export const updateReview = async (
  restaurantId: string,
  review: any,
  previousRating: number
) => {
  const restaurantRef = doc(firestore, `restaurants/${restaurantId}`);
  const reviewRef = doc(
    firestore,
    `restaurants/${restaurantId}/reviews/${review.id}`
  );

  return runTransaction(firestore, async (transaction) => {
    return transaction.get(restaurantRef).then((res) => {
      if (!res.exists) {
        throw "Document does not exist!";
      }

      var oldRatingTotal = res.data()!.avgRating * res.data()!.numRatings;
      var newAvgRating =
        (oldRatingTotal + review.rating - previousRating) /
        res.data()!.numRatings;

      transaction.update(restaurantRef, {
        avgRating: newAvgRating,
      });
      delete review.id;
      transaction.update(reviewRef, review);
    });
  });
};

export const deleteRestaurant = async (restaurantId: string) =>
  await deleteDoc(doc(firestore, `restaurants/${restaurantId}`));

export const selectRestaurantList = (state: any) =>
  state.restaurants?.restaurantList;
export const selectIsFetchingRestaurantList = (state: any) =>
  state.restaurants?.fetchingRestaurantList;
export const selectIsFetchingMoreRestaurants = (state: any) =>
  state.restaurants?.isFetchingMoreRestaurants;
export const selectIsRestaurantListEndReached = (state: any) =>
  state.restaurants?.restaurantListEndReached;
export const selectSelectedRestaurant = (state: any) =>
  state.restaurants?.selectedRestaurant;
export const selectIsFetchingSelectedRestaurant = (state: any) =>
  state.restaurants?.fetchingSelectedRestaurant;
export const selectLastRestaurantSnapshot = (state: any) =>
  state.restaurants?.lastRestaurantSnapshot;

export default restaurantsSlice.reducer;
