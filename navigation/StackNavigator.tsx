import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./TabNavigator";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-community/async-storage";
import * as SplashScreen from "expo-splash-screen";
import {
  ShowPost,
  ConfirmEmail,
  SignUpScreen,
  LoginScreen,
  Comments,
} from "../screens";

export type RootStackParamList = {
  Comments: { postId: string | string };
};

const Stack = createStackNavigator<RootStackParamList>();

const Screens = ({ user, login }) => {
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
      }

      setLoading(false);

      if (loading) await SplashScreen.hideAsync();
    };

    checklogin();
  }, []);

  if (loading) return null;

  return (
    <Stack.Navigator>
      {user.auth.token !== null && user.auth.token !== undefined ? (
        <>
          <Stack.Screen
            name="Home"
            component={TabNavigator}
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
        </>
      ) : (
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

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { login } = bindActionCreators(actions, dispatch);

  return {
    login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Screens);
