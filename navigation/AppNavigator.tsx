import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ConfirmEmail, LoginScreen, MessageScreen, Settings, SignUpScreen } from "../screens";
import BottomTabBar from './TabNavigator';

import * as actions from "../redux/actions";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-community/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { connect } from "react-redux";
import { countMessages } from "../core/api";
import { authSocket } from "../core/socket";

export type AppStackParamList = {
  Main: {};
  Messages: {};
  Settings: {};
};

const Stack = createStackNavigator<AppStackParamList>();

const MainStack = ({auth, user, login, initCounter}: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checklogin = async function () {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }

      const auth = await AsyncStorage.getItem("auth");

      if (auth) {
        const data = JSON.parse(auth);
        login({ ...data });
        const response = await countMessages();
        initCounter({unreadCount:response.unreadCount});
      }

      setLoading(false);

      if (loading) await SplashScreen.hideAsync();
    };

    checklogin();
  }, []);

  if(loading) return null;

  return (
    <Stack.Navigator>
      {auth.token !== null && auth.token !== undefined ? (
        <>
          <Stack.Screen
            name="Main"
            component={BottomTabBar}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Messages"
            component={MessageScreen}
            options={{ headerShown: false }}
          />
        </>
      ): (
        <>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmEmail"
          component={ConfirmEmail}
          options={{ headerShown: false }}
        />
        </>
      )}
    </Stack.Navigator>
  );
};

const mapStateToProps = (state: any) => {
  return {
    auth: state.userReducer.auth,
    counterMessages: state.messanger.counterMessages
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { login, initCounter } = bindActionCreators(actions, dispatch);

  return {
    login,
    initCounter
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainStack);