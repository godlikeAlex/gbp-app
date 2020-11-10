import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import TopBar from "../src/components/TopBar";
import { Profile } from "../src/components";
import { follow, getProfilePosts, getProfile, unfollow, getChat } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { Button } from "@ui-kitten/components";
import localization from "../services/localization";

type UserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "UserScreen"
>;
type UserScreenRouteProp = RouteProp<RootStackParamList, "UserScreen">;

interface UserScreenProps {
  auth: any;
  logOut: any;
  addUser: any;
  toggleFollow: any;
  decFollows: any;
  toggleFollowing: any;
  incFollows: any;
  toggleFollowToUser: any;
  users: any[];
  navigation: UserScreenNavigationProp;
  route: UserScreenRouteProp;
  initPosts: (payload: any) => void;
  selectContact: (payload: {contact: any}) => void;
}

const UserScreen = ({ auth, route, selectContact, addUser, users, toggleFollowToUser, decFollows, incFollows, toggleFollow, toggleFollowing, initPosts }: UserScreenProps) => {
  const { userId } = route.params;
  const user = users.find((user) => user.id === userId);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const toggleFollows = () => {
    toggleFollowToUser({userId: auth.user.id, toggleId: user.id});

    if (user.canSubscribe) {
      incFollows(false);
      follow(user.id);
      toggleFollow({id: auth.user.id, toggleId: user.id});
    } else {
      decFollows(false);
      unfollow(user.id);
      toggleFollow({id: auth.user.id, toggleId: user.id});
    }
  };

  const sendMessage = async () => {
    const {chat} = await getChat(userId);
    if (chat) {
      selectContact({contact: chat});
      navigation.navigate('Messages');
    } else {
      selectContact({contact: {userOne: auth.user.id, userTwo: user.id, user}});
      navigation.navigate('Messages', {isNewChat: true});
    }
  }

  const FollowButton = () => {
    return (
      <Button style={{marginLeft: 15}} size='small' appearance={user.canSubscribe ? "filled" : "outline"} onPress={toggleFollows}>{localization.t(user.canSubscribe ? "follow" : "following")}</Button>
    )
  }

  const MessageButton = () => {
    return (
      <Button style={{marginLeft: 15}} size='small' onPress={sendMessage}>{localization.t("sendMsg")}</Button>
    )
  }

  const UserProfileButtons = () => (
    user && <View style={{flexDirection: 'row'}}>
      <FollowButton />
      <MessageButton />
    </View>
  )

  const EditProfileButton = () => (<Button onPress={() => navigation.navigate('Settings')}>Edit profile</Button>)


  const buttons = [userId === auth.user.id ? <EditProfileButton /> : <UserProfileButtons />];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoadingPosts(true);
    initUserData();
  }, []);

  useEffect(() => {
    initUserData();
  }, []);

  const initUserData = () => {
    getProfile(userId).then((data) => {
      if (!data.error) {
        const category = data.category.find(
          (category: any) => category.locale === "ru"
        );
        addUser({
          ...data.user,
          category: category.name,
          countFollowers: data.countFollowers,
          countFollowings: data.countFollowings,
          canSubscribe: data.canSubscribe,
        });
        setLoading(false);
        setRefreshing(false);
      }
    });
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TopBar title={user.account_name || ''} />
          <Profile profileInfo={user} buttons={buttons} refreshing={refreshing} onRefresh={onRefresh} navigation={navigation} />
        </>
      )}
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    auth: state.userReducer.auth,
    users: state.userReducer.users,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { logOut, addUser, selectContact, initPosts, toggleFollow, toggleFollowToUser, decFollows, incFollows, toggleFollowing } = bindActionCreators(actions, dispatch);

  return {
    logOut,
    addUser,
    toggleFollow,
    toggleFollowToUser,
    decFollows,
    incFollows,
    toggleFollowing,
    initPosts,
    selectContact
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
