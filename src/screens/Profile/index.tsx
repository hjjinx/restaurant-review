import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { AreaView, Button, Header } from "../../common/components";
import Fonts from "../../common/Fonts";
import palette from "../../common/palette";
import { selectUser } from "../../redux/user";

const Profile = ({ navigation }: any) => {
  const user = useSelector(selectUser);
  const signOut = () => {
    auth.signOut();
  };
  return (
    <AreaView noScroll>
      <Header heading={"Profile"} />
      <View style={styles.container}>
        <Text style={styles.heading}>Welcome, {user.name}.</Text>
        <Text style={[styles.subHeading, { marginTop: 10 }]}>
          Thank you for using our platform! If you like it, share the app with
          others. More the people that use this app, more will be it be useful!
        </Text>
        {user.isAdmin ? (
          <TouchableOpacity
            style={styles.users}
            onPress={() => navigation.navigate("Users")}
          >
            <FontAwesome5 name="users" style={styles.userIcon} />
            <Text style={styles.manageUsersText}>Manage Users</Text>
            <Entypo name="chevron-right" style={styles.arrowIcon} />
          </TouchableOpacity>
        ) : (
          <Text style={[styles.subHeading, { marginTop: 10 }]}>
            Didn't see your favourite restaurant in the list?{" "}
            <TouchableWithoutFeedback
              onPress={() => Linking.openURL("mailto:support@example.com")}
            >
              <Text style={[styles.subHeading, styles.contactUs]}>
                Contact us{" "}
              </Text>
            </TouchableWithoutFeedback>
            to become an admin and add it yourself!
          </Text>
        )}
      </View>
      <Text style={styles.footer}>Currently logged in as {user.email}</Text>
      <Button
        onPress={signOut}
        text={"Sign out"}
        style={styles.signoutButton}
      />
    </AreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 15,
  },
  signoutButton: { marginBottom: 20, width: "80%", alignSelf: "center" },
  heading: {
    fontSize: 20,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratMedium,
  },
  subHeading: {
    color: palette.textPrimary,
    fontSize: 16,
    fontFamily: Fonts.MontserratRegular,
    marginBottom: 5,
    lineHeight: 24,
  },
  contactUs: {
    color: palette.hyperlink,
    fontFamily: Fonts.MontserratMedium,
  },
  users: {
    backgroundColor: palette.white,
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  userIcon: {
    fontSize: 30,
    color: palette.primary,
  },
  arrowIcon: {
    fontSize: 25,
    color: palette.textPrimary,
  },
  manageUsersText: {
    fontFamily: Fonts.MontserratMedium,
    color: palette.textPrimary,
    fontSize: 18,
    flex: 1,
    marginHorizontal: 20,
  },
  footer: {
    fontSize: 14,
    color: palette.textPrimary,
    fontFamily: Fonts.MontserratLight,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default Profile;
