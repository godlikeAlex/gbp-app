import React from "react";
import Constants from "expo-constants";
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

const BackIcon = (props) => (
  <Icon
    {...props}
    name="arrow-back"
    style={{ width: 32, height: 32 }}
    fill="black"
  />
);

const BackAction = () => {
  const navigation = useNavigation();

  return (
    <TopNavigationAction
      icon={BackIcon}
      activeOpacity={0.2}
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
    }}
  />
);
