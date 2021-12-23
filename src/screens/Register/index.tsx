import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase";
import { errorHandler } from "../../common/utils";
import { setAlertMessage } from "../../redux/common";
import styles from "../Login/styles";

const Register = ({ navigation }: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (name)
        await updateProfile(auth.currentUser!, {
          displayName: name,
        });
      dispatch(setAlertMessage("Success!"));
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      const _error = errorHandler(err);
      dispatch(setAlertMessage(_error));
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <TextInput
        placeholder="Name.."
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;
