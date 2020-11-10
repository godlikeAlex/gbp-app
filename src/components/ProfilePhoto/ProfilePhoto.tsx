import { Avatar } from "@ui-kitten/components";
import React from "react";
import { StyleSheet, View } from "react-native";
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
  onlineBadge?: boolean;
}

const ProfilePhoto = ({ profilePhoto, width, height, onlineBadge }: ProfilePhotoProps) => {
  return (
    <View>
      <Avatar
        style={{ width, height }}
        source={
          !profilePhoto
            ? BlankUserImage
            : {
                uri: profilePhoto,
              }
        }
      />
      {onlineBadge && (
        <View
          style={{width: 20, height: 20, backgroundColor: '#1ae113', borderRadius: 20, right: 0, bottom: 0, position: 'absolute', borderWidth: 3, borderColor: 'white'}}
        />
      )}
    </View>
  );
};

export default ProfilePhoto;
