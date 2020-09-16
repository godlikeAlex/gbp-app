import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import {
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Text,
  Icon,
} from "@ui-kitten/components";

const { Navigator, Screen } = createBottomTabNavigator();

const HomeScreen = () => (
  <View>
    <Text>Hello world</Text>
  </View>
);

const HomeIcon = (props) => <Icon {...props} name="home" />;
const SearchIcon = (props) => <Icon {...props} name="search" />;
const UserIcon = (props) => <Icon {...props} name="person" />;

const BottomTabBar = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const onSelect = (index: number) => {
    setIndex(index);
    // navigation.navigate(state.routeNames[index]);
  };

  return (
    <BottomNavigation selectedIndex={index} onSelect={onSelect}>
      <BottomNavigationTab icon={HomeIcon} />
      <BottomNavigationTab icon={SearchIcon} />
      <BottomNavigationTab icon={UserIcon} />
    </BottomNavigation>
  );
};

export default () => {
  return (
    <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
      <Screen name="Home" component={HomeScreen} />
    </Navigator>
  );
};
