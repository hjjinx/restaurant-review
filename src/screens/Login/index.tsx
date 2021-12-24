import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import styles from "../../common/styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { errorHandler } from "../../common/utils";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "../../redux/common";
import images from "../../../assets/images";
import { AreaView } from "../../common/components";

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(setAlertMessage("Success!"));
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      const _error = errorHandler(err);
      dispatch(setAlertMessage(_error));
    }
  };
  return (
    <AreaView>
      <Image
        source={images.Login}
        style={styles.loginImage}
        resizeMode="contain"
      />
      <View style={styles.container}>
        <TextInput
          placeholder="Email Address.."
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password.."
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.buttonOutlineText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AreaView>
  );
};

export default Login;
