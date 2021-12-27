import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { AreaView, Button, Header } from "../../common/components";
import Fonts from "../../common/Fonts";
import palette from "../../common/palette";
import { selectUser } from "../../redux/user";

const Profile = () => {
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
      </View>
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
    lineHeight: 20,
  },
});

export default Profile;
