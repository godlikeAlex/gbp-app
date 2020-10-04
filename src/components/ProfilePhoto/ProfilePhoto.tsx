import { Avatar } from "@ui-kitten/components";
import React from "react";
import { StyleSheet } from "react-native";
import BlankUserImage from "../assets/blank-user.jpg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface ProfilePhotoProps {
  profilePhoto?: string;
  width: number;
  height: number;
}

const ProfilePhoto = ({ profilePhoto, width, height }: ProfilePhotoProps) => {
  return (
    <Avatar
      style={{ width, height }}
      source={
        !profilePhoto
          ? BlankUserImage
          : {
              uri:
                "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/d9/d94c7fea789b35eace67cc49c6f2580a7a260742_full.jpg",
            }
      }
    />
  );
};

export default ProfilePhoto;
