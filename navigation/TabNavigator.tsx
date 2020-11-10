import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ProfileStack from "./ProfileNavigator";
import MainStack from "./MainStack";
import SearchStack from "./SearchStack";
import DirectNavigator from "./DirectNavigator";
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
import { ConfirmEmail, LoginScreen, SearchScreen, SignUpScreen } from "../screens";
import Socket, { authSocket, socket } from "../core/socket";
import { View, Text } from "react-native";
import { countMessages } from "../core/api";

const Stack = createStackNavigator();
const { Navigator, Screen } = createBottomTabNavigator();

const HomeIcon = (props: any) => <Icon {...props} name="home" />;
const SearchIcon = (props: any) => <Icon {...props} name="search" />;
const EmailIcon = (props: any) => {
  return (
    <View>
      <Icon {...props} name="email-outline" />
      {props.counterMessages > 0 && (
        <View 
          style={{
            position: 'absolute',
            backgroundColor: 'red', 
            width: 18,
            height: 18,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15,
            top: -5,
            right: -5,
            borderWidth: 2,
            borderColor: 'white'
          }}
        >
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: props.counterMessages <= 9 ? 10 : 8}}>{props.counterMessages > 0 && props.counterMessages}</Text>
        </View>
      )}
    </View>
  )
};
const UserIcon = (props: any) => <Icon {...props} name="person" />;

const BottomTabBar = ({ state, navigation, counterMessages}: {counterMessages: number, state: any, navigation: any}) => {
  const onSelect = (index: number) => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
      <BottomNavigationTab icon={HomeIcon} />
      <BottomNavigationTab icon={SearchIcon} />
      <BottomNavigationTab icon={(props) => <EmailIcon {...props} counterMessages={counterMessages} />} />
      <BottomNavigationTab icon={UserIcon} />
    </BottomNavigation>
  );
};

const BottomBar = ({ counterMessages }) => {
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const checklogin = async function () {
  //     try {
  //       await SplashScreen.preventAutoHideAsync();
  //     } catch (e) {
  //       console.warn(e);
  //     }

  //     const auth = await AsyncStorage.getItem("auth");

  //     if (auth) {
  //       const data = JSON.parse(auth);
  //       authSocket(data.token);
  //       login({ ...data });
  //       const response = await countMessages();
  //       initCounter({unreadCount:response.unreadCount});
  //     }

  //     setLoading(false);

  //     if (loading) await SplashScreen.hideAsync();
  //   };

  //   checklogin();
  // }, []);

  // if (loading) return null;

  return (
    <Navigator tabBar={(props) => <BottomTabBar {...props} counterMessages={counterMessages} />}>
      <Screen name="HomeStack" component={MainStack} />
      <Screen name="Search" component={SearchStack} />
      <Screen name="Direct" component={DirectNavigator} />
      <Screen name="Profile" component={ProfileStack} />
    </Navigator>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.userReducer,
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

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
