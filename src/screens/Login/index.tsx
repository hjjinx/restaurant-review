import React, { useState } from "react";
import { View, Image } from "react-native";
import styles from "../../common/styles";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { errorHandler } from "../../common/utils";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "../../redux/common";
import images from "../../../assets/images";
import { AreaView, Button } from "../../common/components";
import Input from "../../common/components/Input";
import { Formik } from "formik";
import * as Yup from "yup";
import palette from "../../common/palette";

const formSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please Enter a valid Email!")
    .required("Email is Required!"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is Required!"),
});

const Login = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const signIn = async ({ email, password }: any) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
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
        source={images.Login}
        style={styles.loginImage}
        resizeMode="contain"
      />
      <View style={[styles.container, { paddingHorizontal: "5%" }]}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={signIn}
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
                    text={"Login"}
                    onPress={submitForm}
                    loading={loading}
                    disabled={loading}
                  />
                </View>
                <Button
                  text={"Register"}
                  style={styles.buttonOutline}
                  onPress={() => navigation.navigate("Register")}
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

export default Login;
