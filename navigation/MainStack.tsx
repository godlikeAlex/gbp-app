import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import {} from "../screens";
import { Text } from "react-native";
import { Feed, UserScreen } from "../screens";

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
        component={Feed}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
