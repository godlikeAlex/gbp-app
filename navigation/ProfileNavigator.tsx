import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ShowPost,
  Comments,
  UserScreen,
  MyProfileScreen,
  Follows,
} from "../screens";

export type RootStackParamList = {
  MyProfile: {};
  UserScreen: { userId: number };
  ShowPost: {};
  Follows: { type: "followers" | "followings"; userId: number };
  Comments: { postId: string | string };
};

const Stack = createStackNavigator<RootStackParamList>();

const Screens = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Follows"
        component={Follows}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserScreen"
        component={UserScreen}
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
    </Stack.Navigator>
  );
};

export default Screens;
