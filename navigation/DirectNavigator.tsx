import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import {} from "../screens";
import { Text } from "react-native";
import { DirectScreen, Feed, Settings, UserScreen } from "../screens";
import BottomTabBar from './TabNavigator';

export type RootStackParamList = {
  Direct: {};
  UserScreen: {};
  Settings: {};
};

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Direct"
        component={DirectScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
