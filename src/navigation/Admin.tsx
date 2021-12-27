import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import palette from "../common/palette";
import Fonts from "../common/Fonts";
import Restaurants from "../screens/Restaurants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddRestaurant from "../screens/Restaurants/AddRestaurant";
import RestaurantDetail from "../screens/Restaurant";
import Profile from "../screens/Profile";
import AddReview from "../screens/Restaurant/AddReview";

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
    case "Profile":
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
      <AdminTabs.Screen
        name="Restaurants"
        component={RestaurantStackComponent}
      />
      <AdminTabs.Screen name="Profile" component={Profile} />
    </AdminTabs.Navigator>
  );
}

const RestaurantStack = createNativeStackNavigator();
const RestaurantStackComponent = () => {
  return (
    <RestaurantStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RestaurantStack.Screen name="RestaurantsList" component={Restaurants} />
      <RestaurantStack.Screen name="AddRestaurant" component={AddRestaurant} />
      <RestaurantStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetail}
      />
      <RestaurantStack.Screen name="AddReview" component={AddReview} />
    </RestaurantStack.Navigator>
  );
};

export default AdminStackComponent;
