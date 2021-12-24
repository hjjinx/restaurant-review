import { Entypo } from "@expo/vector-icons";
import React from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { AreaView } from "../../common/components";
import Header from "../../common/components/Header";
import palette from "../../common/palette";
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
  return (
    <AreaView noScroll>
      <Header heading={"Restaurants"} />
      <View style={styles.listContainer}>
        <FlatList
          data={mock}
          renderItem={({ item }) => (
            <View style={{ paddingBottom: 16 }}>
              <RestaurantCard
                name={item.name}
                address={item.address}
                rating={item.rating}
                image={{
                  uri: "https://b.zmtcdn.com/data/pictures/3/19027493/cf8ab1dab3454e89a05273322b78ec13_o2_featured_v2.jpg?output-format=webp",
                }}
              />
            </View>
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
        />
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
