import { Entypo } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView } from "../../common/components";
import Header from "../../common/components/Header";
import palette from "../../common/palette";
import {
  getRestaurants,
  selectIsFetchingRestaurantList,
  selectRestaurantList,
} from "../../redux/restaurants";
import RestaurantCard from "./RestaurantCard";

const mock = [
  {
    id: 1,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 2,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 4,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 5,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 6,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 7,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
  {
    id: 8,
    name: "Boathouse",
    address: "Elante Mall, Chandigarh, Industrial Area Phase I, India",
    rating: 4.2,
  },
];

const Restaurants = ({ navigation }: any) => {
  const restaurantList = useSelector(selectRestaurantList);
  const loading = useSelector(selectIsFetchingRestaurantList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRestaurants(0));
  }, []);
  return (
    <AreaView noScroll>
      <Header heading={"Restaurants"} />
      <View style={styles.listContainer}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={palette.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={restaurantList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ paddingBottom: 16 }}
                onPress={() =>
                  navigation.navigate("RestaurantDetail", {
                    restaurantId: item.id,
                  })
                }
              >
                <RestaurantCard
                  name={item.name}
                  address={item.address}
                  rating={item.avgRating}
                  numRatings={item.numRatings}
                  image={{
                    uri: item.imageUri,
                  }}
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.fabButton}
        activeOpacity={0.4}
        onPress={() => navigation.navigate("AddRestaurant")}
      >
        <Entypo name="plus" style={styles.fabPlusIcon} />
      </TouchableOpacity>
    </AreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  fabButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
    backgroundColor: palette.primary,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  fabPlusIcon: {
    fontSize: 40,
    color: palette.white,
  },
});

export default Restaurants;
