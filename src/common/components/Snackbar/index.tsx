import SnackBar from "react-native-snackbar-component";
import { useSelector } from "react-redux";
import { selectAlertMessage } from "../../../redux/common";

const Snackbar = () => {
  const alertMessageText = useSelector(selectAlertMessage);
  return (
    <SnackBar
      visible={!!alertMessageText}
      textMessage={alertMessageText}
      actionHandler={() => {
        console.log("snackbar button clicked!");
      }}
      actionText="OK"
    />
  );
};

export default Snackbar;
