import React from "react";
import { SafeAreaView, StatusBar, StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AreaViewProps = {
  children: React.ReactNode;
  noScroll?: boolean;
};

const AreaView = (props: AreaViewProps) => {
  const { children, noScroll } = props;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar></StatusBar>
      {noScroll ? (
        children
      ) : (
        <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
      )}
    </SafeAreaView>
  );
};
export default AreaView;
