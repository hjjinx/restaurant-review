import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView, Header } from "../../common/components";
import palette from "../../common/palette";
import { setAlertMessage } from "../../redux/common";
import {
  deleteUser,
  getUserList,
  selectIsFetchingMoreUsers,
  selectIsFetchingUserList,
  selectIsUserListEndReached,
  selectLastUserSnapshot,
  selectUser,
  selectUserList,
} from "../../redux/user";
import UserCard from "./UserCard";

const Users = () => {
  const user = useSelector(selectUser);
  const userList = useSelector(selectUserList);
  const lastUserSnapshot = useSelector(selectLastUserSnapshot);
  const loading = useSelector(selectIsFetchingUserList);
  const isFetchingMore = useSelector(selectIsFetchingMoreUsers);
  const isEndReached = useSelector(selectIsUserListEndReached);
  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserList());
  }, []);

  const _deleteUser = async (userId: any) => {
    setDeleteLoading(true);
    try {
      await deleteUser(userId);
      setDeleteLoading(false);
      dispatch(getUserList());
    } catch (err) {
      dispatch(setAlertMessage("There was an error in deleting the user!"));
      setDeleteLoading(false);
    }
  };

  const onDeleteUser = (userId: any) => {
    Alert.alert("Delete", "Are you sure you want to delete this review?", [
      {
        text: "Yes",
        onPress: () => _deleteUser(userId),
      },
      { text: "Cancel", onPress: () => {} },
    ]);
  };

  return (
    <AreaView noScroll>
      <Header heading={"Users"} canGoBack />
      <View style={styles.listContainer}>
        {loading || deleteLoading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={palette.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={userList.filter((i: any) => i.id != user.uid)}
            renderItem={({ item }) => (
              <UserCard
                userName={item.name}
                dateOfJoining={new Date(item.dateOfJoining?.seconds * 1000)}
                rating={"5"}
                email={item.email}
                deletable
                onPressDelete={() => onDeleteUser(item.id)}
                isAdmin={item.isAdmin}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => dispatch(getUserList(false))}
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={() =>
              !isFetchingMore &&
              !isEndReached &&
              dispatch(getUserList(lastUserSnapshot))
            }
            ListFooterComponent={
              isFetchingMore && (
                <View style={{ padding: 10 }}>
                  <ActivityIndicator color={palette.primary} size="small" />
                </View>
              )
            }
          />
        )}
      </View>
    </AreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
});

export default Users;
