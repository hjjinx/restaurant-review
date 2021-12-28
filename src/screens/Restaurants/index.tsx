import { Entypo } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView, Header } from "../../common/components";
import palette from "../../common/palette";
import {
  getRestaurants,
  selectIsFetchingMoreRestaurants,
  selectIsFetchingRestaurantList,
  selectIsRestaurantListEndReached,
  selectLastRestaurantSnapshot,
  selectRestaurantList,
} from "../../redux/restaurants";
import { selectUser } from "../../redux/user";
import RestaurantCard from "./RestaurantCard";

const Restaurants = ({ navigation }: any) => {
  const user = useSelector(selectUser);
  const restaurantList = useSelector(selectRestaurantList);
  const lastRestaurantSnapshot = useSelector(selectLastRestaurantSnapshot);
  const loading = useSelector(selectIsFetchingRestaurantList);
  const isFetchingMore = useSelector(selectIsFetchingMoreRestaurants);
  const isEndReached = useSelector(selectIsRestaurantListEndReached);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getRestaurants(false));
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
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => dispatch(getRestaurants(false))}
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={() =>
              !isFetchingMore &&
              !isEndReached &&
              dispatch(getRestaurants(lastRestaurantSnapshot))
            }
            ListFooterComponent={
              isFetchingMore && (
                <View style={{ padding: 10 }}>
                  <ActivityIndicator color={palette.primary} size="small" />
                </View>
              )
            }
          />
        )}
      </View>
      {user?.isAdmin && (
        <TouchableOpacity
          style={styles.fabButton}
          activeOpacity={0.4}
          onPress={() => navigation.navigate("AddRestaurant")}
        >
          <Entypo name="plus" style={styles.fabPlusIcon} />
        </TouchableOpacity>
      )}
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
