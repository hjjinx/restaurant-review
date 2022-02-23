import React from "react";
import { SafeAreaView, StatusBar, StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/user";
import palette from "../../palette";

type AreaViewProps = {
  children: React.ReactNode;
  noScroll?: boolean;
};

const AreaView = (props: AreaViewProps) => {
  const { children, noScroll } = props;
  const user = useSelector(selectUser);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        barStyle={user ? "light-content" : "dark-content"}
        backgroundColor={user ? palette.primary : palette.lightWhitebackground}
      ></StatusBar>
      {noScroll ? (
        children
      ) : (
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          {children}
        </KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};
export default AreaView;
