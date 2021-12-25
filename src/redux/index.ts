import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./common";
import restaurantsReducer from "./restaurants";

const store = configureStore({
  reducer: {
    common: commonReducer,
    restaurants: restaurantsReducer,
  },
});

export default store;
