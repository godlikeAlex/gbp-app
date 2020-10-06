import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileStack from "./ProfileNavigator";
import MainStack from "./MainStack";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";
import * as actions from "../redux/actions";
import { bindActionCreators } from "redux";
import AsyncStorage from "@react-native-community/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { connect } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { ConfirmEmail, LoginScreen, SignUpScreen } from "../screens";

const Stack = createStackNavigator();
const { Navigator, Screen } = createBottomTabNavigator();

const HomeIcon = (props: any) => <Icon {...props} name="home" />;
const SearchIcon = (props: any) => <Icon {...props} name="search" />;
const UserIcon = (props: any) => <Icon {...props} name="person" />;

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

const BottomBar = ({ user, login }) => {
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
    <>
      {user.auth.token !== null && user.auth.token !== undefined ? (
        <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
          <Screen name="HomeStack" component={MainStack} />
          <Screen name="Search" component={MainStack} />
          <Screen name="Profile" component={ProfileStack} />
        </Navigator>
      ) : (
        <Stack.Navigator>
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
        </Stack.Navigator>
      )}
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
