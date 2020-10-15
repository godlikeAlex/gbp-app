import { useNavigation } from "@react-navigation/native";
import { Button, Layout, Text } from "@ui-kitten/components";
import React from "react";
import { FlatList, StyleSheet, TouchableHighlight, View } from "react-native";
import { getFollowers, unfollow, getFollowings, follow } from "../core/api";
import { ProfilePhoto } from "../src/components";
import { StyleGuide } from "../src/components/StyleGuide";
import localization from "../services/localization";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import LoadingSpinner from "../src/components/LoadingSpinner";

interface FollowTabProps {
  type: string;
  auth: any;
  userId: number | string;
  toggleFollow: any;
  followers: any;
  followings: any;
  initFollowers: any;
  initFollowings: any;
  toggleFollowing: any;
  incFollows: any;
  decFollows: any;
}

const FollowTab = ({
  type,
  userId,
  toggleFollow,
  followers,
  followings,
  initFollowers,
  initFollowings,
  toggleFollowing,
  incFollows,
  decFollows,
  auth
}: FollowTabProps) => {
  const navigation = useNavigation();
  const [state, setState] = React.useState({
    limit: 6,
    offset: 0,
    size: 0,
    page: 1,
  });
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (type === "followers") {
      getFollowers(userId, { page: 1 }).then((data) => {
        if (!data.error) {
          initFollowers({ id: userId, followers: data.followers });
          const { limit, offset, size } = data;
          setState({
            limit,
            offset,
            size,
            page: 1,
          });
          setLoading(false);
        }
      });
    } else {
      getFollowings(userId, { page: 1 }).then((data) => {
        if (!data.error) {
          initFollowings({ id: userId, followings: data.followings });
          const { limit, offset, size } = data;
          setState({
            limit,
            offset,
            size,
            page: 1,
          });
          setLoading(false);
        }
      });
    }
  }, []);

  const handleClick = (id: number, subscribed: boolean) => {
    if (subscribed) {
      decFollows(false);
      if (type === "followers") {
        toggleFollow({ id: userId, toggleId: id });
      } else {
        toggleFollowing({ id: userId, toggleId: id });
      }
      unfollow(id);
    } else {
      incFollows(false);
      follow(id);
      if (type === "followers") {
        toggleFollow({ id: userId, toggleId: id });
      } else {
        toggleFollowing({ id: userId, toggleId: id });
      }
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => navigation.navigate(auth.id !== item.id  ? "UserScreen" : "MyProfile", { userId: item.id })}
        >
          <Layout
            style={{
              ...StyleGuide.padding.horizontal,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 5,
              borderTopWidth: 1,
              borderColor: "#edeef1",
            }}
          >
            <ProfilePhoto
              width={55}
              height={55}
              profilePhoto={item.profile_photo}
            />
            <Layout
              style={{
                flexDirection: "column",
                paddingLeft: 15,
                backgroundColor: "transparent",
                flex: 1,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ color: "gray" }}>{item.account_name}</Text>
            </Layout>
          </Layout>
        </TouchableHighlight>
        <View
          style={{
            position: "absolute",
            top: 0,
            height: "100%",
            justifyContent: "center",
            right: StyleGuide.spacing,
          }}
        >
          {auth.id !== item.id && (
            <Button
              onPress={() => handleClick(item.id, item.subscribed)}
              appearance={item.subscribed ? "outline" : "filled"}
            >
              {localization.t(item.subscribed ? "following" : "follow")} 
            </Button>
          )}
        </View>
      </View>
    );
  };

  return (
    <Layout style={{ flex: 1 }}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={type === "followers" ? followers[userId] : followings[userId]}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
        />
      )}
    </Layout>
  );
};

const mapStateToProps = (state: { userReducer: any; follows: any }) => {
  const { followers, followings } = state.follows;
  return {
    auth: state.userReducer.myProfile,
    followers,
    followings,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const {
    toggleFollow,
    initFollowers,
    initFollowings,
    toggleFollowing,
    incFollows,
    decFollows,
  } = bindActionCreators(actions, dispatch);

  return {
    toggleFollow,
    initFollowers,
    initFollowings,
    toggleFollowing,
    incFollows,
    decFollows,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowTab);
