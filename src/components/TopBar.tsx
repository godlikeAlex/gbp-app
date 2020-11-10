import React from "react";
import Constants from "expo-constants";
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { StyleGuide } from "./StyleGuide";
import { StyleProp, StyleSheetProperties, ViewStyle } from "react-native";

const BackIcon = (props) => <Icon {...props} name="arrow-back" fill="black" />;

const BackAction = ({onBackAction}: {onBackAction: () => void}) => {
  const navigation = useNavigation();

  return (
    <TopNavigationAction
      icon={BackIcon}
      activeOpacity={0.2}
      style={{ marginLeft: 0 }}
      onPress={() => onBackAction ? onBackAction() : navigation.goBack()}
    />
  );
};

interface TopBarProps {
  title?: string | any;
  accessoryRight?: any;
  style?: StyleProp<ViewStyle>;
  onBackAction?: () => void;
}

export default ({ title, accessoryRight, style, onBackAction }: TopBarProps) => (
  <TopNavigation
    accessoryLeft={() => <BackAction {...{onBackAction}} />}
    title={title}
    style={{
      marginTop: Constants.statusBarHeight,
      marginLeft: 0,
      paddingLeft: StyleGuide.spacing,
      ...style
    }}
    accessoryRight={accessoryRight}
  />
);
