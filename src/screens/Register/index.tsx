import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, Text, View, Image } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase";
import { errorHandler } from "../../common/utils";
import { setAlertMessage } from "../../redux/common";
import styles from "../../common/styles";
import images from "../../../assets/images";
import { AreaView } from "../../common/components";

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
    <AreaView>
      <Image
        source={images.Register}
        style={styles.registerImage}
        resizeMode="contain"
      />
      <View style={styles.container}>
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
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonOutlineText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AreaView>
  );
};

export default Register;
