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
} from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { roundRating } from "../common/utils";

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurantList: [],
    fetchingRestaurantList: false,
  },
  reducers: {
    setRestaurantListRequest: (state) => {
      state.fetchingRestaurantList = true;
    },
    setRestaurantListSuccess: (state, action) => {
      state.restaurantList = action.payload;
      state.fetchingRestaurantList = false;
    },
    setRestaurantListError: (state) => {
      state.fetchingRestaurantList = false;
    },
  },
});

export const {
  setRestaurantListRequest,
  setRestaurantListSuccess,
  setRestaurantListError,
} = restaurantsSlice.actions;

export const getRestaurants =
  (offset: number, count: number = 10) =>
  async (dispatch: any) => {
    try {
      dispatch(setRestaurantListRequest());
      const q = query(
        collection(firestore, "restaurants"),
        orderBy("avgRating", "desc"),
        limit(count)
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      for (let doc of querySnapshot.docs) {
        const uri = await getDownloadURL(
          ref(storage, `restaurantImages/${doc.id}`)
        );
        data.push({ ...doc.data(), id: doc.id, imageUri: uri });
      }
      dispatch(setRestaurantListSuccess(data));
    } catch (error) {
      console.log({ error });
      dispatch(setRestaurantListError());
    }
  };

export const getRestaurant = async (restaurantId: string, user: any) => {
  try {
    const restaurantData = await getDoc(
      doc(firestore, `restaurants/${restaurantId}`)
    );
    const uri = await getDownloadURL(
      ref(storage, `restaurantImages/${restaurantId}`)
    );
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
          highestRatedReview.createdBy = { ...user?.data(), uid: user.id };
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
          lowestRatedReview.createdBy = { ...user?.data(), uid: user.id };
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
          latestRatedReview.createdBy = { ...user?.data(), uid: user.id };
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
      return {
        ...restaurantData.data(),
        id: restaurantData.id,
        imageUri: uri,
        highestRatedReview,
        lowestRatedReview,
        latestRatedReview,
        loggedInUserReview,
      };
    }
  } catch (err) {
    console.log({ err });
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
      avgRating: roundRating(
        (restaurant?.avgRating * restaurant.numRatings - review.rating) /
          (restaurant.numRatings - 1)
      ),
    });
    afterDelete(restaurantId);
  } catch (err) {
    console.log({ err });
  }
};

// function addRating(restaurantId: string, review: any) {
//   const restaurantRef = doc(firestore, `restaurants/${restaurantId}`);
//   const ratingRef = doc(
//     collection(firestore, `restaurants/${restaurantId}/reviews`)
//   );

//   // In a transaction, add the new rating and update the aggregate totals
//   return runTransaction(firestore, async (transaction) => {
//     return transaction.get(restaurantRef).then((res) => {
//       if (!res.exists) {
//         throw "Document does not exist!";
//       }

//       // Compute new number of ratings
//       var newNumRatings = res.data().numRatings + 1;

//       // Compute new average rating
//       var oldRatingTotal = res.data().avgRating * res.data().numRatings;
//       var newAvgRating = (oldRatingTotal + review.rating) / newNumRatings;

//       // Commit to Firestore
//       transaction.update(restaurantRef, {
//         numRatings: newNumRatings,
//         avgRating: newAvgRating,
//       });
//       transaction.set(ratingRef, review);
//     });
//   });
// }

export const selectRestaurantList = (state: any) =>
  state.restaurants?.restaurantList;
export const selectIsFetchingRestaurantList = (state: any) =>
  state.restaurants?.fetchingRestaurantList;

export default restaurantsSlice.reducer;
