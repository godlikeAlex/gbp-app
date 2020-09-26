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
import {UserScreen} from '../screens';

const { Navigator, Screen } = createBottomTabNavigator();

const HomeScreen = () => (
  <View>
    <Text>Hello world</Text>
  </View>
);

const HomeIcon = (props) => <Icon {...props} name="home" />;
const SearchIcon = (props) => <Icon {...props} name="search" />;
const UserIcon = (props) => <Icon {...props} name="person" />;

const BottomTabBar = ({ state, navigation }) => {

  const onSelect = (index: number) => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
      <BottomNavigationTab icon={HomeIcon} />
      <BottomNavigationTab icon={SearchIcon} />
      <BottomNavigationTab icon={UserIcon} />
    </BottomNavigation>
  );
};

export default () => {
  return (
    <Navigator backBehavior="history" tabBar={(props) => <BottomTabBar {...props} />}>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Search" component={HomeScreen} />
      <Screen name="Profile" component={UserScreen} />
    </Navigator>
  );
};
