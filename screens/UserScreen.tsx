import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  ScrollView,
  Image,
} from "react-native";
import { Avatar, Text, Layout, Button } from "@ui-kitten/components";
import TopBar from "../src/components/TopBar";
import localization from "../services/localization";
import { StyleGuide, theme } from "../src/components/StyleGuide";
import { ProfileInfo, GridProfile } from "../src/components";
import { getPhoto, getPrivewProfilePosts, getProfile } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: "center",
  },
});

interface UserScreenProps {
  auth: any;
}

const UserScreen = ({ auth }: UserScreenProps) => {
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
          (category) => category.locale === "ru"
        );
        setProfile({
          ...data.user,
          category: category.name,
          countFollowers: data.countFollowers,
          countFollowings: data.countFollowings,
        });
        setLoading(false);
        getPrivewProfilePosts(9).then((data) => {
          if (!data.error) {
            setPosts(data.posts);
          }
        });
      }
    });
  }, []);
  return (
    <>
      <TopBar title={auth.user.account_name} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView>
          <ProfileInfo {...{ profile }} />
          <GridProfile posts={posts} />
        </ScrollView>
      )}
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    auth: state.userReducer.auth,
  };
};

export default connect(mapStateToProps)(UserScreen);
