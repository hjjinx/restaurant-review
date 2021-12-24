import { StyleSheet } from "react-native";
import Fonts from "./Fonts";
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
    fontFamily: Fonts.MontserratMedium,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: palette.primary,
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: palette.white,
    fontSize: 14,
    textTransform: "capitalize",
    letterSpacing: 1,
    fontFamily: Fonts.MontserratMedium,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: palette.primary,
  },
  buttonOutlineText: {
    color: palette.black,
    fontFamily: Fonts.MontserratMedium,
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
