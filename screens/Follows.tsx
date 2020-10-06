import React, { useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View, Text } from "react-native";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import TopBar from "../src/components/TopBar";
import localization from "../services/localization";
import { getFollowers } from "../core/api";
import { FlatList, TouchableHighlight } from "react-native-gesture-handler";
import { Layout } from "@ui-kitten/components";
import { StyleGuide } from "../src/components/StyleGuide";
import { ProfilePhoto } from "../src/components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type CommentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Follows"
>;
type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Follows">;

interface FollowsProps {
  navigation: CommentsScreenNavigationProp;
  route: CommentsScreenRouteProp;
}

const Follows = ({ route }: FollowsProps) => {
  const navigation = useNavigation();
  const [state, setState] = useState({
    followers: [],
    limit: 6,
    offset: 0,
    size: 0,
  });

  const { type, userId } = route.params;

  React.useEffect(() => {
    getFollowers(userId, { page: 1 }).then((data) => {
      if (!data.error) {
        setState(data);
      }
    });
  }, []);

  const renderItem = ({ item }: any) => {
    return (
      <TouchableHighlight
        onPress={() => navigation.navigate("Profile", { userId: item.id })}
      >
        <Layout
          style={{
            ...StyleGuide.padding.horizontal,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <ProfilePhoto width={55} height={55} />
          <Layout
            style={{
              flexDirection: "column",
              paddingLeft: 15,
              backgroundColor: "transparent",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "gray" }}>Aleksandr Yurkovsky</Text>
          </Layout>
        </Layout>
      </TouchableHighlight>
    );
  };

  return (
    <View>
      <TopBar title={localization.t(type)} />
      <FlatList
        data={state.followers}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default Follows;
