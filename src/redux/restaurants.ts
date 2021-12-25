import { createSlice } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

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
      const q = query(collection(firestore, "restaurants"));
      const querySnapshot = await getDocs(q);
      const data = [];
      for (let doc of querySnapshot.docs) {
        const storage = getStorage();
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

export const selectRestaurantList = (state: any) =>
  state.restaurants.restaurantList;
export const selectIsFetchingRestaurantList = (state: any) =>
  state.restaurants.fetchingRestaurantList;

export default restaurantsSlice.reducer;
