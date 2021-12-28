import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../firebase";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: {},
    fetchingUserList: false,
    usersList: [],
    lastUserSnapshot: null,
    isFetchingMoreUsers: false,
    userListEndReached: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },

    setUserListRequest: (state, action) => {
      if (action.payload.isFetchingMore) state.isFetchingMoreUsers = true;
      else state.fetchingUserList = true;
    },
    setUserListSuccess: (state, action) => {
      state.lastUserSnapshot = action.payload.lastUserSnapshot;
      state.isFetchingMoreUsers = false;
      state.fetchingUserList = false;
      state.userListEndReached = false;
      if (action.payload.isFetchingMore) {
        state.usersList = [...state.usersList, ...action.payload.data] as any;
      } else {
        state.usersList = action.payload.data;
      }
    },
    setUserListError: (state) => {
      state.fetchingUserList = false;
      state.isFetchingMoreUsers = false;
    },

    setUserListEndReached: (state, action) => {
      state.userListEndReached = action.payload;
      state.fetchingUserList = false;
      state.isFetchingMoreUsers = false;
    },
  },
});

export const {
  setUser,
  setUserListRequest,
  setUserListError,
  setUserListSuccess,
  setUserListEndReached,
} = userSlice.actions;

export const getUserList =
  (lastUserSnapshot: any = false, count: number = 10) =>
  async (dispatch: any) => {
    try {
      dispatch(setUserListRequest({ isFetchingMore: !!lastUserSnapshot }));
      let q;
      if (lastUserSnapshot)
        q = query(
          collection(firestore, "users"),
          orderBy("dateOfJoining", "desc"),
          startAfter(lastUserSnapshot),
          limit(count)
        );
      else
        q = query(
          collection(firestore, "users"),
          limit(count),
          orderBy("dateOfJoining", "desc")
        );
      const querySnapshot = await getDocs(q);
      const data = [];
      if (querySnapshot.empty) {
        dispatch(setUserListEndReached(true));
        return;
      }
      for (let doc of querySnapshot.docs) {
        data.push({ ...doc.data(), id: doc.id });
      }
      dispatch(
        setUserListSuccess({
          data,
          lastUserSnapshot: querySnapshot.docs[querySnapshot.docs.length - 1],
          isFetchingMore: !!lastUserSnapshot,
        })
      );
    } catch (error) {
      console.log({ error });
      dispatch(setUserListError());
    }
  };

export const selectUser = (state: any) => state.user.userData;
export const selectUserList = (state: any) => state.user.usersList;
export const selectIsFetchingUserList = (state: any) =>
  state.user.fetchingUserList;
export const selectIsFetchingMoreUsers = (state: any) =>
  state.user.isFetchingMoreUsers;
export const selectLastUserSnapshot = (state: any) =>
  state.user.lastUserSnapshot;
export const selectIsUserListEndReached = (state: any) =>
  state.user.userListEndReached;

export default userSlice.reducer;
