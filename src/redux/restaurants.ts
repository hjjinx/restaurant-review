import { createSlice } from "@reduxjs/toolkit";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase";

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState: {
    restaurantList: [],
  },
  reducers: {
    setRestaurantList: (state, action) => {
      state.restaurantList = action.payload;
    },
  },
});

export const { setRestaurantList: _setRestaurantList } =
  restaurantsSlice.actions;

export const getRestaurants = (message: string) => async (dispatch) => {
  const q = query(collection(firestore, "restaurants"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
};

export const selectRestaurantList = (state: any) =>
  state.restaurants.RestaurantList;

export default restaurantsSlice.reducer;
