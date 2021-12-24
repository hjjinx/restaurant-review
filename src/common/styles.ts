import { StyleSheet } from "react-native";
import palette from "./palette";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    marginVertical: 4,
    width: "80%",
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontFamily: "MontserratMedium",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: palette.primary,
    marginVertical: 3,
    marginHorizontal: "15%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: palette.white,
    fontFamily: "MontserratMedium",
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: palette.primary,
  },
  buttonOutlineText: {
    color: palette.black,
    fontFamily: "MontserratMedium",
  },
  registerImage: {
    alignSelf: "center",
    width: "80%",
    height: 300,
    marginTop: 10,
  },
  loginImage: {
    alignSelf: "center",
    width: "80%",
    height: 300,
    marginTop: 30,
    marginBottom: 20,
  },
});
