import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";

const AuthenticationStack = createNativeStackNavigator();

function AuthenticationStackComponent() {
  return (
    <AuthenticationStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthenticationStack.Screen name="Login" component={Login} />
      <AuthenticationStack.Screen name="Register" component={Register} />
    </AuthenticationStack.Navigator>
  );
}

export default AuthenticationStackComponent;
