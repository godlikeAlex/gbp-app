import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { getPhoto } from "../../../core/api";
import { Layout } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface GridProfileProps {
  posts: Array<any>;
}

const GridProfile = ({ posts }: GridProfileProps) => {
  const navigation = useNavigation();

  return (
    <Layout
      level="4"
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        flex: 1,
      }}
    >
      {posts.map((post, i) => (
        <View key={i} style={{ width: "33%", height: 135, paddingBottom: 2 }}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#000"
            onPress={() => navigation.navigate("ShowPost", { id: post.id })}
          >
            <View>
              <Image
                source={{ uri: getPhoto(post.content[0].uri) }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </TouchableHighlight>
        </View>
      ))}
    </Layout>
  );
};

export default GridProfile;
