import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { View, Image } from "react-native";
import { useDispatch } from "react-redux";
import { auth, firestore } from "../../../firebase";
import { errorHandler } from "../../common/utils";
import { setAlertMessage } from "../../redux/common";
import styles from "../../common/styles";
import images from "../../../assets/images";
import { AreaView, Button } from "../../common/components";
import { Formik } from "formik";
import * as Yup from "yup";
import palette from "../../common/palette";
import Input from "../../common/components/Input";
import { doc, setDoc } from "firebase/firestore";
import { setUser } from "../../redux/user";

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please Enter a valid Email!")
    .required("Email is Required!"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required!"),
});

const Register = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const signUp = async ({ name, email, password }: any) => {
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (name)
        await updateProfile(auth.currentUser!, {
          displayName: name,
        });
      await setDoc(doc(firestore, "users", user.user.uid), {
        name,
        isAdmin: false,
      });
      dispatch(setUser({ name, isAdmin: false, uid: user.user.uid }));
      dispatch(setAlertMessage("Success!"));
      setLoading(false);
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      const _error = errorHandler(err);
      dispatch(setAlertMessage(_error));
      setLoading(false);
    }
  };
  return (
    <AreaView>
      <Image
        source={images.Register}
        style={styles.registerImage}
        resizeMode="contain"
      />
      <View
        style={[styles.container, { marginTop: 20, paddingHorizontal: "5%" }]}
      >
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
          }}
          onSubmit={signUp}
          validationSchema={formSchema}
        >
          {({
            values,
            setValues,
            submitForm,
            errors,
            touched,
            setFieldTouched,
          }) => (
            <>
              <View style={{ marginBottom: 30 }}>
                <Input
                  placeholder={"Enter your name"}
                  placeholderTextColor={palette.placeholder}
                  label={"Name"}
                  value={values.name}
                  setValue={(s) => {
                    setFieldTouched("name");
                    setValues({ ...values, name: s });
                  }}
                  error={touched.name && errors.name}
                  onBlur={() => setFieldTouched("name")}
                />
              </View>
              <View style={{ marginBottom: 30 }}>
                <Input
                  placeholder={"Enter Email"}
                  placeholderTextColor={palette.placeholder}
                  label={"Email"}
                  keyboardType="email-address"
                  value={values.email}
                  setValue={(s) => {
                    setFieldTouched("email");
                    setValues({ ...values, email: s });
                  }}
                  error={touched.email && errors.email}
                  onBlur={() => setFieldTouched("email")}
                  autoCapitalize="none"
                />
              </View>
              <View style={{ marginBottom: 30 }}>
                <Input
                  placeholder={"Enter your password"}
                  placeholderTextColor={palette.placeholder}
                  label={"Password"}
                  isPassword
                  value={values.password}
                  setValue={(s) => {
                    setFieldTouched("password");
                    setValues({ ...values, password: s });
                  }}
                  error={touched.password && errors.password}
                  onBlur={() => setFieldTouched("password")}
                />
              </View>
              <View style={styles.buttonsContainer}>
                <View style={{ marginBottom: 8 }}>
                  <Button
                    text={"Register"}
                    onPress={submitForm}
                    loading={loading}
                  />
                </View>
                <Button
                  text={"Login"}
                  style={styles.buttonOutline}
                  onPress={() => navigation.navigate("Login")}
                  textStyle={styles.buttonOutlineText}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </AreaView>
  );
};

export default Register;
