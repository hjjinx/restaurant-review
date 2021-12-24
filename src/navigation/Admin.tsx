import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import palette from "../common/palette";
import Fonts from "../common/Fonts";

const AdminTabs = createBottomTabNavigator();

const renderTabBarIcon = (
  routeName: string,
  focused: boolean,
  color: string,
  size: any
) => {
  switch (routeName) {
    case "Restaurants":
      return (
        <Ionicons
          name={focused ? "restaurant" : "restaurant-outline"}
          size={size}
          color={color}
        />
      );
    case "Users":
      return (
        <FontAwesome
          name={focused ? "user-circle" : "user-circle-o"}
          size={size}
          color={color}
        />
      );
  }
};

function AdminStackComponent() {
  return (
    <AdminTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          return renderTabBarIcon(route.name, focused, color, size);
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: Fonts.MontserratMedium,
        },
      })}
    >
      <AdminTabs.Screen name="Restaurants" component={Login} />
      <AdminTabs.Screen name="Users" component={Register} />
    </AdminTabs.Navigator>
  );
}

export default AdminStackComponent;
