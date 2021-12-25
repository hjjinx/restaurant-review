import React from "react";
import { View } from "react-native";
import { auth } from "../../../firebase";
import { Button } from "../../common/components";

const Users = () => {
  const signOut = () => {
    auth.signOut();
  };
  return (
    <View style={{ padding: 40 }}>
      <Button onPress={signOut} text={"Sign out"} />
    </View>
  );
};

export default Users;
