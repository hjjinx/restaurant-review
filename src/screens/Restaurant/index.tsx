import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { OverlayLoader } from "../../common/components";
import Fonts from "../../common/Fonts";
import palette from "../../common/palette";
import { getRestaurant } from "../../redux/restaurants";

const RestaurantDetail = ({ navigation, route }: any) => {
  const restaurantId = route?.params?.restaurantId;
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState<any>();
  const _getRestaurant = async (restaurantId: string) => {
    try {
      setLoading(true);
      const data = await getRestaurant(restaurantId);
      setRestaurant(data);
      console.log({ data });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    _getRestaurant(restaurantId);
  }, []);
  return (
    <SafeAreaView style={styles.areaView}>
      {loading ? (
        <OverlayLoader
          color={palette.primary}
          containerStyle={{ backgroundColor: palette.white }}
        />
      ) : (
        <>
          <View>
            <ImageBackground
              style={{ width: "100%", height: 260 }}
              resizeMode="cover"
              source={{ uri: restaurant?.imageUri }}
            >
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backIconContainer}
              >
                <AntDesign name="arrowleft" style={styles.chevronIcon} />
              </TouchableOpacity>
            </ImageBackground>
            <View style={styles.box}>
              <Text style={styles.title}>{restaurant?.name}</Text>
              <Text style={styles.address}>{restaurant?.address}</Text>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default RestaurantDetail;

const styles = StyleSheet.create({
  areaView: {
    backgroundColor: palette.white,
    flex: 1,
  },
  box: {
    position: "absolute",
    top: 200,
    backgroundColor: palette.white,
    borderTopLeftRadius: 40,
    borderTopEndRadius: 40,
    width: "100%",
    paddingHorizontal: 10,
  },
  backIconContainer: {
    marginLeft: 15,
    marginTop: 16,
    zIndex: 1,
    backgroundColor: palette.primary,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  chevronIcon: {
    fontSize: 25,
    color: palette.white,
  },
  title: {
    fontSize: 20,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
    padding: 16,
  },
  address: {
    color: "gray",
    fontSize: 15,
    fontFamily: Fonts.MontserratRegular,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
});
