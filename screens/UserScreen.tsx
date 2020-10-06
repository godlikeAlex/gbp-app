import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import TopBar from "../src/components/TopBar";
import { Profile } from "../src/components";
import { getPrivewProfilePosts, getProfile } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

type UserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;
type UserScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

interface UserScreenProps {
  auth: any;
  logOut: any;
  addUser: any;
  users: any[];
  navigation: UserScreenNavigationProp;
  route: UserScreenRouteProp;
}

const UserScreen = ({ auth, route, addUser, users }: UserScreenProps) => {
  const { userId } = route.params;
  const user = users.find((user) => user.id === userId);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      // REFRESH
      // POST STORE
      setLoading(false);
      getPrivewProfilePosts(userId).then((data) => {
        if (!data.error) {
          setPosts(data.posts);
        }
      });
    } else {
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
          getPrivewProfilePosts(userId).then((data) => {
            if (!data.error) {
              setPosts(data.posts);
            }
          });
        }
      });
    }
  }, []);

  return (
    <>
      <TopBar title={auth.user.account_name} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Profile profileInfo={user} posts={posts} />
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
  const { logOut, addUser } = bindActionCreators(actions, dispatch);

  return {
    logOut,
    addUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
