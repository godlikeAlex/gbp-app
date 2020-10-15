import React, { useEffect, useMemo, useState } from "react";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StyleSheet, View, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import TopBar from "../src/components/TopBar";
import localization from "../services/localization";
import { Layout, Text } from "@ui-kitten/components";
import FollowTab from "./FollowTab";
import { useFocusEffect } from "@react-navigation/native";

type CommentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Follows"
>;
type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Follows">;

interface FollowsProps {
  navigation: CommentsScreenNavigationProp;
  route: CommentsScreenRouteProp;
}

const initialLayout = { width: Dimensions.get("window").width };

const Follows = ({ route }: FollowsProps) => {
  const { type, userId } = route.params;

  const [index, setIndex] = useState(type === "followers" ? 0 : 1);

  const renderScene = useMemo(
    () =>
      SceneMap({
      first: () => <FollowTab userId={userId} type="followers" />,
        second: () => <FollowTab userId={userId} type="followings" />,
      }),
    [userId]
  );

  const [routes] = useState([
    { key: "first", title: localization.t("followers") },
    { key: "second", title: localization.t("followings") },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "blue" }}
      style={{ backgroundColor: "white" }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: "blue", margin: 8 }}>{route.title}</Text>
      )}
    />
  );

  return (
    <Layout style={{ flex: 1 }}>
      <TopBar title={localization.t(type)} />
      <TabView
        lazy
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </Layout>
  );
};

export default Follows;
