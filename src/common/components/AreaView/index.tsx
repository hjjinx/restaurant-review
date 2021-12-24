import React from "react";
import { SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AreaViewProps = {
  children: React.ReactNode;
};

const AreaView = (props: AreaViewProps) => {
  const { children } = props;
  return (
    <SafeAreaView style={{ flex: 1, paddingVertical: 20 }}>
      <KeyboardAwareScrollView>{children}</KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default AreaView;
