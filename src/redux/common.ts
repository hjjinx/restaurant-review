import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    alertMessageText: 0,
  },
  reducers: {
    setAlertMessage: (state, action) => {
      state.alertMessageText = action.payload;
    },
  },
});

export const { setAlertMessage: _setAlertMessage } = commonSlice.actions;

export const setAlertMessage = (message: string) => (dispatch) => {
  dispatch(_setAlertMessage(message));
  setTimeout(() => {
    dispatch(_setAlertMessage(""));
  }, 2000);
};

export const selectAlertMessage = (state: any) => state.common.alertMessageText;

export default commonSlice.reducer;
