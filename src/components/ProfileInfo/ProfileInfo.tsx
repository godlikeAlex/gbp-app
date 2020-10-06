import React from "react";
import { TouchableNativeFeedback, View } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import { theme, StyleGuide } from "../StyleGuide";
import localization from "../../../services/localization";
import ProfilePhoto from "../ProfilePhoto";
import { useNavigation } from "@react-navigation/native";

interface ProfileInfoProps {
  profile: {
    id: number;
    name: string;
    profile_photo?: string;
    description: string;
    countFollowers: number;
    countFollowings: number;
    category?: string;
  };
}

const ProfileInfo = ({ profile }: ProfileInfoProps) => {
  const navigation = useNavigation();
  const {
    id,
    name,
    description,
    countFollowers,
    countFollowings,
    profile_photo,
    category,
  } = profile;

  return (
    <Layout style={{ ...theme.center }} level="2">
      <ProfilePhoto profilePhoto={profile_photo} width={100} height={100} />
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
          onPress={() =>
            navigation.navigate("Follows", { type: "followers", userId: id })
          }
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
          onPress={() =>
            navigation.navigate("Follows", { type: "followings", userId: id })
          }
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

export default ProfileInfo;