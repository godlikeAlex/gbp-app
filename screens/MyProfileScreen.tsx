import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  OverflowMenu,
  TopNavigationAction,
  MenuItem,
  Icon,
} from "@ui-kitten/components";
import TopBar from "../src/components/TopBar";
import { Profile } from "../src/components";
import { getPrivewProfilePosts, getProfile } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import AsyncStorage from "@react-native-community/async-storage";

const MenuIcon = (props: any) => <Icon {...props} name="more-vertical" />;

const LogoutIcon = (props: any) => <Icon {...props} name="log-out" />;

interface UserScreenProps {
  auth: any;
  logOut: any;
}

const UserScreen = ({ auth, logOut }: UserScreenProps) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    user: {
      name: "",
    },
    countFollowings: 0,
    countFollowers: 0,
    profile_photo: undefined,
    isOnwer: true,
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getProfile(auth.user.id).then((data) => {
      if (!data.error) {
        const category = data.category.find(
          (category: any) => category.locale === "ru"
        );
        setProfile({
          ...data.user,
          category: category.name,
          countFollowers: data.countFollowers,
          countFollowings: data.countFollowings,
          canSubscribe: data.canSubscribe,
        });
        setLoading(false);
        getPrivewProfilePosts(auth.user.id).then((data) => {
          if (!data.error) {
            setPosts(data.posts);
          }
        });
      }
    });
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
        <Profile profileInfo={profile} posts={posts} />
      )}
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    auth: state.userReducer.auth,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { logOut } = bindActionCreators(actions, dispatch);

  return {
    logOut,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
