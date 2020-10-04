import React from "react";
import Constants from "expo-constants";
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { StyleGuide } from "./StyleGuide";

const BackIcon = (props) => <Icon {...props} name="arrow-back" fill="black" />;

const BackAction = () => {
  const navigation = useNavigation();

  return (
    <TopNavigationAction
      icon={BackIcon}
      activeOpacity={0.2}
      style={{ marginLeft: 0 }}
      onPress={() => navigation.goBack()}
    />
  );
};

interface TopBarProps {
  title?: string;
}

export default ({ title }: TopBarProps) => (
  <TopNavigation
    accessoryLeft={BackAction}
    title={title}
    style={{
      marginTop: Constants.statusBarHeight,
      marginLeft: 0,
      paddingLeft: StyleGuide.spacing,
    }}
  />
);
