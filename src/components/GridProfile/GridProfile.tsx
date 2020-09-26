import React from "react";
import { StyleSheet, View, Image, TouchableHighlight } from "react-native";
import { getPhoto } from "../../../core/api";
import { Layout } from "@ui-kitten/components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface GridProfileProps {
  posts: Array<any>;
}

const GridProfile = ({ posts }: GridProfileProps) => {
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
            onPress={() => console.log("true")}
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
