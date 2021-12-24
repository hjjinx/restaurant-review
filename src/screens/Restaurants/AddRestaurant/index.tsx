import React from "react";
import { AreaView, Button, ImageUploadBox } from "../../../common/components";
import Header from "../../../common/components/Header";
import { Formik } from "formik";
import * as Yup from "yup";
import { View, StyleSheet } from "react-native";
import Input from "../../../common/components/Input";
import palette from "../../../common/palette";
import TextArea from "../../../common/components/TextArea";

const formSchema = Yup.object().shape({
  name: Yup.string().required("Name is required!"),
  address: Yup.string().required("Address is required!"),
  image: Yup.string().required("Image is required!"),
});

const AddRestaurant = () => {
  const addRestaurant = (values: any) => {};
  return (
    <AreaView>
      <Header heading={"Add Restaurant"} canGoBack />
      <View style={styles.formContainer}>
        <Formik
          initialValues={{
            name: "",
            address: "",
            image: "",
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
                  image={
                    values.image
                      ? { uri: `data:image/png;base64,${values.image}` }
                      : ""
                  }
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
                  text="Submit"
                  style={{ marginTop: 10 }}
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
