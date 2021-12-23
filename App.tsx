import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationStackComponent } from "./src/navigation";
import { Provider } from "react-redux";
import store from "./src/redux";
import { Snackbar } from "./src/common/components";

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AuthenticationStackComponent />
      </NavigationContainer>
      <Snackbar />
    </Provider>
  );
}
