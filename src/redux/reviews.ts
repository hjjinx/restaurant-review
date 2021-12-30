import { createSlice } from "@reduxjs/toolkit";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../firebase";

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    fetchingReviewList: false,
    reviewsList: [],
    lastReviewSnapshot: null,
    isFetchingMoreReviews: false,
    reviewListEndReached: false,
  },
  reducers: {
    setReviewListRequest: (state, action) => {
      if (action.payload.isFetchingMore) state.isFetchingMoreReviews = true;
      else state.fetchingReviewList = true;
    },
    setReviewListSuccess: (state, action) => {
      state.lastReviewSnapshot = action.payload.lastReviewSnapshot;
      state.isFetchingMoreReviews = false;
      state.fetchingReviewList = false;
      state.reviewListEndReached = false;
      if (action.payload.isFetchingMore) {
        state.reviewsList = [
          ...state.reviewsList,
          ...action.payload.data,
        ] as any;
      } else {
        state.reviewsList = action.payload.data;
      }
    },
    setReviewListError: (state) => {
      state.fetchingReviewList = false;
      state.isFetchingMoreReviews = false;
    },

    setReviewListEndReached: (state, action) => {
      state.reviewListEndReached = action.payload;
      state.fetchingReviewList = false;
      state.isFetchingMoreReviews = false;
    },
  },
});

export const {
  setReviewListRequest,
  setReviewListError,
  setReviewListSuccess,
  setReviewListEndReached,
} = reviewSlice.actions;

export const getReviewList =
  (restaurantId: string, lastReviewSnapshot: any = false, count: number = 10) =>
  async (dispatch: any) => {
    try {
      dispatch(setReviewListRequest({ isFetchingMore: !!lastReviewSnapshot }));
      let q;
      if (lastReviewSnapshot)
        q = query(
          collection(firestore, `restaurants/${restaurantId}/reviews`),
          orderBy("dateOfVisit", "desc"),
          startAfter(lastReviewSnapshot),
          limit(count)
        );
      else
        q = query(
          collection(firestore, `restaurants/${restaurantId}/reviews`),
          limit(count),
          orderBy("dateOfVisit", "desc")
        );
      const querySnapshot = await getDocs(q);
      const data = [];
      if (querySnapshot.empty) {
        if (!lastReviewSnapshot)
          dispatch(
            setReviewListSuccess({
              data: [],
              lastReviewSnapshot: null,
              isFetchingMore: false,
            })
          );
        dispatch(setReviewListEndReached(true));
        return;
      }
      for (let _doc of querySnapshot.docs) {
        const docData = _doc.data();
        const user = await getDoc(doc(firestore, `users/${docData.createdBy}`));
        if (user.exists())
          docData.createdBy = { ...user?.data(), uid: user.id };
        else docData.createdBy = { name: "Anonymous", uid: 0 };
        docData.id = docData?.docs?.[0]?.id;
        data.push({ ...docData, id: _doc.id });
      }
      dispatch(
        setReviewListSuccess({
          data,
          lastReviewSnapshot: querySnapshot.docs[querySnapshot.docs.length - 1],
          isFetchingMore: !!lastReviewSnapshot,
        })
      );
    } catch (error) {
      console.log({ error });
      dispatch(setReviewListError());
    }
  };

export const selectReviewList = (state: any) => state.reviews.reviewsList;
export const selectIsFetchingReviewList = (state: any) =>
  state.reviews.fetchingReviewList;
export const selectIsFetchingMoreReviews = (state: any) =>
  state.reviews.isFetchingMoreReviews;
export const selectLastReviewSnapshot = (state: any) =>
  state.reviews.lastReviewSnapshot;
export const selectIsReviewListEndReached = (state: any) =>
  state.reviews.reviewListEndReached;

export default reviewSlice.reducer;
