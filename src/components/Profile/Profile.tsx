import React from "react";
import { TouchableNativeFeedback, View } from "react-native";
import { Avatar, Layout, Text } from "@ui-kitten/components";
import { theme, StyleGuide } from "../StyleGuide";
import localization from "../../../services/localization";
import BlankUserImage from "../assets/blank-user.jpg";

interface ProfileProps {
  profile: {
    name: string;
    profile_photo?: string;
    description: string;
    countFollowers: number;
    countFollowings: number;
    category?: string;
  };
}

const Profile = ({ profile }: ProfileProps) => {
  const {
    name,
    description,
    countFollowers,
    countFollowings,
    profile_photo,
    category,
  } = profile;

  return (
    <Layout style={{ ...theme.center }} level="2">
      <Avatar
        style={{ width: 100, height: 100, marginVertical: 20 }}
        source={
          !profile_photo
            ? BlankUserImage
            : {
                uri:
                  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/d9/d94c7fea789b35eace67cc49c6f2580a7a260742_full.jpg",
              }
        }
      />
      <Text style={theme.boldText} category="h4">
        {name}
      </Text>
      <Text style={StyleGuide.margin.top}>{category}</Text>
      {Boolean(description) && (
        <Text
          style={[
            StyleGuide.padding.top,
            StyleGuide.padding.horizontal,
            theme.centerText,
          ]}
          appearance="hint"
        >
          {description}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "50%",
        }}
      >
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("#EEE")}
          onPress={() => console.log(false)}
        >
          <View style={{ padding: 15 }}>
            <Text style={[theme.centerText, theme.boldText, { fontSize: 16 }]}>
              {countFollowers}
            </Text>
            <Text>{localization.t("user.followers")}</Text>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("#EEE")}
          onPress={() => console.log(false)}
        >
          <View style={{ padding: 15 }}>
            <Text style={[theme.centerText, theme.boldText, { fontSize: 16 }]}>
              {countFollowings}
            </Text>
            <Text>{localization.t("user.followings")}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </Layout>
  );
};

export default Profile;
