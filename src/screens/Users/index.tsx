import React, { useEffect } from "react";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AreaView, Header } from "../../common/components";
import palette from "../../common/palette";
import {
  getUserList,
  selectIsFetchingMoreUsers,
  selectIsFetchingUserList,
  selectIsUserListEndReached,
  selectLastUserSnapshot,
  selectUser,
  selectUserList,
} from "../../redux/user";
import UserCard from "./UserCard";

const Users = ({ navigation }: any) => {
  const user = useSelector(selectUser);
  const userList = useSelector(selectUserList);
  const lastUserSnapshot = useSelector(selectLastUserSnapshot);
  const loading = useSelector(selectIsFetchingUserList);
  const isFetchingMore = useSelector(selectIsFetchingMoreUsers);
  const isEndReached = useSelector(selectIsUserListEndReached);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserList());
  }, []);
  return (
    <AreaView noScroll>
      <Header heading={"Users"} />
      <View style={styles.listContainer}>
        {loading ? (
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
