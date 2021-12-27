import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../../../firebase";
import { AreaView, Button, Header } from "../../common/components";
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
        <Text>Welcome {user.name}</Text>
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
});

export default Profile;
