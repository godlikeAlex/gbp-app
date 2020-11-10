import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import {} from "../screens";
import { Text } from "react-native";
import { Feed, Follows, Settings, ShowPost, UserScreen, Comments, UsersByCategory } from "../screens";

export type MainStackParamList = {
  Home: {};
  UserScreen: {};
  Follows: {};
  ShowPost: {};
  Comments: {};
  UsersByCategory: {
    categoryId: number | string;
    categoryName: string;
  };
};

const Stack = createStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Feed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Follows"
        component={Follows}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowPost"
        component={ShowPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UsersByCategory"
        component={UsersByCategory}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
