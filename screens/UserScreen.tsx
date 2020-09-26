import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  ScrollView,
} from "react-native";
import { Avatar, Text, Layout, Button } from "@ui-kitten/components";
import TopBar from "../src/components/TopBar";
import localization from "../services/localization";
import { StyleGuide, theme } from "../src/components/StyleGuide";
import { ProfileInfo } from "../src/components";
import { getProfile } from "../core/api";
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
  const posts = new Array(9).fill("");
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

  useEffect(() => {
    getProfile(auth.user.id).then((data) => {
      if (!data.error) {
        setProfile({
          ...data.user,
          countFollowers: data.countFollowers,
          countFollowings: data.countFollowings,
        });
        setLoading(false);
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
          <Layout
            level="4"
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {posts.map((post, i) => (
              <View
                key={i}
                style={{ width: "33%", height: 150, paddingBottom: 2 }}
              >
                <View
                  style={{
                    backgroundColor: "purple",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            ))}
          </Layout>
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
