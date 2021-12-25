import React, { useState } from "react";
import { AreaView, Button, ImageUploadBox } from "../../../common/components";
import Header from "../../../common/components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import { View, StyleSheet, Platform } from "react-native";
import Input from "../../../common/components/Input";
import palette from "../../../common/palette";
import TextArea from "../../../common/components/TextArea";
import { firestore, storage } from "../../../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setAlertMessage } from "../../../redux/common";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { convertFileUriToBlob } from "../../../common/utils";
import { getRestaurants } from "../../../redux/restaurants";

const formSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  address: Yup.string().required("Address is required!"),
  image: Yup.object().required("Image is required!"),
});

const AddRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const addRestaurant = async (values: any) => {
    setLoading(true);
    try {
      let uri = values.image.uri;
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      const blob = await convertFileUriToBlob(uploadUri);
      delete values.image;

      const doc = await addDoc(collection(firestore, "restaurants"), values);
      const restaurantImageRef = ref(storage, `restaurantImages/${doc.id}`);
      await uploadBytes(restaurantImageRef, blob);
      dispatch(setAlertMessage("Success!"));
      dispatch(getRestaurants(0));
      navigation.goBack();
    } catch (err) {
      console.log({ err });
      dispatch(setAlertMessage("There was an error. Please try again later."));
    }
    setLoading(false);
  };
  return (
    <AreaView>
      <Header heading={"Add Restaurant"} canGoBack />
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            name: "",
            address: "",
            image: "" as any,
          }}
          onSubmit={addRestaurant}
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
              <View style={{ marginVertical: 10, marginBottom: 40 }}>
                <ImageUploadBox
                  setImage={(s) => {
                    setFieldTouched("image");
                    setValues({ ...values, image: s });
                  }}
                  image={values.image?.uri ? { uri: values.image.uri } : null}
                  error={touched.image && errors.image}
                />
              </View>
              <View style={{ marginBottom: 20 }}>
                <Input
                  placeholder={"Enter name of the restaurant"}
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
                <TextArea
                  placeholder={"Enter address of the restaurant"}
                  placeholderTextColor={palette.placeholder}
                  label={"Address"}
                  value={values.address}
                  onChangeText={(s) => {
                    setFieldTouched("address");
                    setValues({ ...values, address: s });
                  }}
                  error={touched.address && errors.address}
                  onBlur={() => setFieldTouched("address")}
                />
              </View>
              <View>
                <Button
                  onPress={submitForm}
                  text="+ Add"
                  style={{ marginTop: 10 }}
                  loading={loading}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </AreaView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default AddRestaurant;
