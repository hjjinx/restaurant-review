import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    width: "80%",
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#ccc",
    marginVertical: 5,
    marginHorizontal: "15%",
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
  },
  buttonOutline: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
