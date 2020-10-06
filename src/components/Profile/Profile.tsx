import React from "react";
import { ScrollView } from "react-native";
import { GridProfile, ProfileInfo } from "..";

interface ProfileProps {
  profileInfo: any;
  posts: Array<any>;
}

const Profile = ({ profileInfo, posts }: ProfileProps) => {
  return (
    <ScrollView>
      <ProfileInfo profile={profileInfo} />
      <GridProfile posts={posts} />
    </ScrollView>
  );
};

export default Profile;
