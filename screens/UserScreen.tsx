import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import TopBar from "../src/components/TopBar";
import { Profile } from "../src/components";
import { follow, getProfilePosts, getProfile, unfollow } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { Text } from "react-native";
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
}

const UserScreen = ({ auth, route, addUser, users, toggleFollowToUser, decFollows, incFollows, toggleFollow, toggleFollowing, initPosts }: UserScreenProps) => {
  const { userId } = route.params;
  const user = users.find((user) => user.id === userId);

  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);
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

  const FollowButton = () => {
    return (
      user && <Button  appearance={user.canSubscribe ? "filled" : "outline"} onPress={toggleFollows}>{localization.t(user.canSubscribe ? "follow" : "following")}</Button>
    )
  }

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

    getProfilePosts(userId, {page: 1}).then((data) => {
      if (!data.error) {
        const {posts} = data;
        initPosts({id: userId, posts, initialLoading: false});
      }
    });
  }

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TopBar title={user.account_name} />
          <Profile profileInfo={user} buttons={[<FollowButton />]} posts={posts} loadingPosts={loadingPosts} refreshing={refreshing} onRefresh={onRefresh} />
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
  const { logOut, addUser, initPosts, toggleFollow, toggleFollowToUser, decFollows, incFollows, toggleFollowing } = bindActionCreators(actions, dispatch);

  return {
    logOut,
    addUser,
    toggleFollow,
    toggleFollowToUser,
    decFollows,
    incFollows,
    toggleFollowing,
    initPosts
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
