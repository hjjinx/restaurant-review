import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { firestore, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

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

export const getRestaurant = async (restaurantId: string) => {
  try {
    const restaurantData = await getDoc(
      doc(firestore, `restaurants/${restaurantId}`)
    );
    const uri = await getDownloadURL(
      ref(storage, `restaurantImages/${restaurantId}`)
    );
    const highestRatedReviewSnapshot = await getDocs(
      query(
        collection(firestore, `restaurants/${restaurantId}/reviews`),
        orderBy("rating", "desc"),
        limit(1)
      )
    );
    const highestRatedReview =
      highestRatedReviewSnapshot?.docs?.[0]?.data() || {};

    const lowestRatedReviewSnapshot = await getDocs(
      query(
        collection(firestore, `restaurants/${restaurantId}/reviews`),
        orderBy("rating", "asc"),
        limit(1)
      )
    );
    const lowestRatedReview = lowestRatedReviewSnapshot?.docs?.[0]?.data();

    const latestRatedReviewSnapshot = await getDocs(
      query(
        collection(firestore, `restaurants/${restaurantId}/reviews`),
        orderBy("dateOfVisit", "desc"),
        limit(1)
      )
    );
    const latestRatedReview = latestRatedReviewSnapshot?.docs?.[0]?.data();
    if (restaurantData.exists()) {
      return {
        ...restaurantData.data(),
        id: restaurantData.id,
        imageUri: uri,
        highestRatedReview,
        lowestRatedReview,
        latestRatedReview,
      };
    }
  } catch (err) {
    console.log({ err });
  }
};

export const selectRestaurantList = (state: any) =>
  state.restaurants.restaurantList;
export const selectIsFetchingRestaurantList = (state: any) =>
  state.restaurants.fetchingRestaurantList;

export default restaurantsSlice.reducer;
