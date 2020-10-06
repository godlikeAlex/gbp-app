import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {} from "../screens";
import { Text } from "react-native";

export type RootStackParamList = {
  Home: {};
};

const Stack = createStackNavigator<RootStackParamList>();

const Home = () => <Text>Hello world</Text>;

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
