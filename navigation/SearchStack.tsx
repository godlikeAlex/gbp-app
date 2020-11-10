import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import {} from "../screens";
import { Text } from "react-native";
import { Follows, ShowPost, UserScreen, Comments, UsersByCategory, SearchScreen } from "../screens";

export type SearchStackParamList = {
  SearchStack: {};
  UserScreen: {};
  Follows: {};
  ShowPost: {};
  Comments: {};
  UsersByCategory: {
    categoryId: number | string;
    categoryName: string;
  };
};

const Stack = createStackNavigator<SearchStackParamList>();

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchStack"
        component={SearchScreen}
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

export default SearchStack;
