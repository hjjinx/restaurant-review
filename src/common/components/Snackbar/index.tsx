import SnackBar from "react-native-snackbar-component";
import { useDispatch, useSelector } from "react-redux";
import { selectAlertMessage, setAlertMessage } from "../../../redux/common";

const Snackbar = () => {
  const dispatch = useDispatch();
  const alertMessageText = useSelector(selectAlertMessage);
  return (
    <SnackBar
      visible={!!alertMessageText}
      textMessage={alertMessageText}
      actionHandler={() => dispatch(setAlertMessage(""))}
      actionText="OK"
    />
  );
};

export default Snackbar;
