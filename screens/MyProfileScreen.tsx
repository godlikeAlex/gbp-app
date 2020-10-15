import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  OverflowMenu,
  TopNavigationAction,
  MenuItem,
  Icon,
  Button,
} from "@ui-kitten/components";
import TopBar from "../src/components/TopBar";
import { Profile } from "../src/components";
import { getProfilePosts, getProfile } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import AsyncStorage from "@react-native-community/async-storage";

const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />;

const LogoutIcon = (props: any) => <Icon {...props} name="log-out" />;

interface UserScreenProps {
  auth: any;
  logOut: any;
  initProfile: any;
  profile: any;
  initPosts: any;
  navigation: any;
}

const UserScreen = ({
  auth,
  logOut,
  profile,
  initProfile,
  initPosts,
  navigation
}: UserScreenProps) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const EditProfileButton = () => (<Button onPress={() => true}>Edit profile</Button>)

  useEffect(() => {
    initProfileData();
  }, []);


  const initProfileData = () => {
    getProfile(auth.user.id).then((data) => {
      if (!data.error) {
        const category = data.category.find(
          (category: any) => category.locale === "ru"
        );
        initProfile({
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

    getProfilePosts(auth.user.id, {page: 1}).then((data) => {
      if (!data.error) {
        const {posts} = data;
        initPosts({id: auth.user.id, posts, initialLoading: false});
      }
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    initProfileData();
  }, []);

  const logOutHandle = () => {
    AsyncStorage.removeItem("auth").then(() => {
      logOut();
    });
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderRightActions = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={logOutHandle}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  return (
    <>
      <TopBar
        title={auth.user.account_name}
        accessoryRight={renderRightActions}
      />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Profile 
          profileInfo={profile}
          buttons={[<EditProfileButton />]} 
          refreshing={refreshing}
          onRefresh={onRefresh} 
          navigation={navigation}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    auth: state.userReducer.auth,
    profile: state.userReducer.myProfile,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { logOut, initProfile, initPosts } = bindActionCreators(actions, dispatch);

  return {
    logOut,
    initProfile,
    initPosts
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
