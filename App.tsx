import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  MainTabComponent,
  AuthenticationStackComponent,
} from "./src/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { persistor } from "./src/redux";
import { OverlayLoader, Snackbar } from "./src/common/components";
import { auth } from "./firebase";
import { useFonts } from "expo-font";
import { selectUser, setUser } from "./src/redux/user";
import { PersistGate } from "redux-persist/integration/react";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Setting a timer",
  "non-serializable value",
  "AsyncStorage has been extracted",
  "SerializableStateInvariantMiddleware",
]);

const App = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  let [fontsLoaded] = useFonts({
    MontserratBold: require("./assets/fonts/Montserrat/Montserrat-Black.ttf"),
    MontserratLight: require("./assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontserratMedium: require("./assets/fonts/Montserrat/Montserrat-Medium.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    ShizuruRegular: require("./assets/fonts/Shizuru/Shizuru-Regular.ttf"),
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user?.uid) dispatch(setUser(null));
    });
    return unsubscribe;
  }, []);
  if (!fontsLoaded) return <OverlayLoader />;
  return !user?.uid ? (
    <AuthenticationStackComponent />
  ) : (
    <MainTabComponent user={user} />
  );
};

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer>
        <App />
      </NavigationContainer>
      <Snackbar />
    </PersistGate>
  </Provider>
);
