import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "./common";
import restaurantsReducer from "./restaurants";
import userReducer from "./user";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

const combinedReducer = combineReducers({
  common: commonReducer,
  restaurants: restaurantsReducer,
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, combinedReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
