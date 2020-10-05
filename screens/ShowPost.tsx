import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import TopBar from "../src/components/TopBar";
import { Layout } from "@ui-kitten/components";
import { Post } from "../src/components";
import { PostProps } from "../src/components/Post/Post";
import { getPost } from "../core/api";
import LoadingSpinner from "../src/components/LoadingSpinner";
import localization from "../services/localization";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const ShowPost = ({ route }: any) => {
  const { id: postId } = route.params;

  const [post, setPost] = useState<PostProps>({
    id: 0,
    description: "",
    isLiked: false,
    comments: [],
    content: [],
    user: null,
    likes_count: 0,
  });
  const [loading, setLoading] = useState(true);

  const {
    id,
    description,
    isLiked,
    comments,
    content,
    user,
    likes_count,
    createdAt,
  } = post;

  useEffect(() => {
    getPost(postId).then((data) => {
      if (!data.error) {
        setPost(data);
        setLoading(false);
      }
    });
  }, []);

  return (
    // Maybe broken
    <Layout style={{ flex: 1 }}>
      <TopBar title={localization.t("post")} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Post
          {...{
            id,
            description,
            isLiked,
            comments,
            content,
            user,
            likes_count,
            createdAt,
          }}
        />
      )}
    </Layout>
  );
};

export default ShowPost;
