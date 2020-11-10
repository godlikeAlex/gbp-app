import { Button, Layout } from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import ProfilePhoto from '../ProfilePhoto';
import { StyleGuide } from '../StyleGuide';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as actions from "../../../redux/actions";

import localization from "../../../services/localization";
import { follow, getPhoto, unfollow } from '../../../core/api';
import { useNavigation } from '@react-navigation/native';


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface UserProfileListItemProps {
  userId: number | string;
  profile_photo?: string; 
  name: string;
  account_name: string;
  id: number;
  subscribed: boolean;
  auth: any;
  accessoryRight?: any;
  showOnline?: boolean;

  decFollows: (param: boolean) => void;
  incFollows: (param: boolean) => void;
  toggleFollow: (param: any) => void;
  toggleFollowing: (param: any) => void;
  onPress?: () => void;
}


const UserProfileListItem = ({
  // userId,
  profile_photo,
  name,
  account_name,
  id,
  auth,
  subscribed,
  onPress,
  accessoryRight,
  showOnline
  // decFollows,
  // toggleFollow,
  // incFollows,
  // toggleFollowing,
}: UserProfileListItemProps) => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableHighlight
        onPress={
          () => onPress ? onPress() : navigation.navigate(auth.id !== id  ? "UserScreen" : "MyProfile", { userId: id })
        }
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
            profilePhoto={profile_photo ? getPhoto(profile_photo): undefined}
            onlineBadge={showOnline}
          />
          <Layout
            style={{
              flexDirection: "column",
              paddingLeft: 15,
              backgroundColor: "transparent",
              flex: 1,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{name}</Text>
            <Text style={{ color: "gray" }}>{account_name}</Text>
          </Layout>
          {accessoryRight && accessoryRight}
        </Layout>
      </TouchableHighlight>
    </View>
  );
};

const mapStateToProps = (state: { userReducer: any; follows: any }) => {
  return {
    auth: state.userReducer.myProfile,
  };
};

// const mapDispatchToProps = (dispatch: any) => {
//   const {
//     toggleFollow,
//     initFollowers,
//     initFollowings,
//     toggleFollowing,
//     incFollows,
//     decFollows,
//   } = bindActionCreators(actions, dispatch);

//   return {
//     toggleFollow,
//     initFollowers,
//     initFollowings,
//     toggleFollowing,
//     incFollows,
//     decFollows,
//   };
// };

// export default UserProfileListItem;

export default connect(
  mapStateToProps,
  null
)(UserProfileListItem);