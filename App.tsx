import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  AdminStackComponent,
  AuthenticationStackComponent,
} from "./src/navigation";
import { Provider } from "react-redux";
import store from "./src/redux";
import { OverlayLoader, Snackbar } from "./src/common/components";
import { auth } from "./firebase";
import { useFonts } from "expo-font";

export default function App() {
  const [user, setUser] = useState<any>();
  let [fontsLoaded] = useFonts({
    MontserratBold: require("./assets/fonts/Montserrat/Montserrat-Black.ttf"),
    MontserratLight: require("./assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontserratMedium: require("./assets/fonts/Montserrat/Montserrat-Medium.ttf"),
    MontserratRegular: require("./assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    ShizuruRegular: require("./assets/fonts/Shizuru/Shizuru-Regular.ttf"),
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUser(user);
      else setUser(user);
    });
    return unsubscribe;
  }, []);
  if (!fontsLoaded) return <OverlayLoader />;
  return (
    <Provider store={store}>
      <NavigationContainer>
        {!user ? <AuthenticationStackComponent /> : <AdminStackComponent />}
      </NavigationContainer>
      <Snackbar />
    </Provider>
  );
}
