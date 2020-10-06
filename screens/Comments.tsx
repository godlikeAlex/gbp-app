import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  View,
} from "react-native";
import TopBar from "../src/components/TopBar";
import { Layout, Input, Icon, Text, Spinner } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import { RouteProp } from "@react-navigation/native";
import { createComment, getComments, toggleLike } from "../core/api";
import { ProfilePhoto } from "../src/components";
import { StyleGuide, theme } from "../src/components/StyleGuide";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Moment from "react-moment";
import "moment/locale/ru";
import LoadingSpinner from "../src/components/LoadingSpinner";
import localization from "../services/localization";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    ...StyleGuide.padding.horizontal,
    paddingVertical: 5,
    alignSelf: "stretch",
  },
  commentContainer: {
    ...StyleGuide.padding.horizontal,
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#edeef1",
  },
  commentContent: {
    paddingLeft: 10,
    flexDirection: "column",
  },
  icon: {
    width: 16,
    height: 16,
  },
});

type CommentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Comments"
>;
type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

type Props = {
  navigation: CommentsScreenNavigationProp;
  route: CommentsScreenRouteProp;
  auth: any;
};

interface CommentProps {
  id: number;
  content: string;
  isLiked: boolean;
  likes: number;
  user: {
    id: number;
    name: string;
    profile_photo?: string;
  };
  createdAt: string;
}

export const Comment = ({ item: comment }: { item: CommentProps }) => {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);
  const setLike = () => {
    setLiked((isLiked) => !isLiked);

    setLikes((likes) => {
      toggleLike(comment.id, "comment");
      if (liked) return likes - 1;
      else return likes + 1;
    });
  };

  return (
    <Layout style={styles.commentContainer}>
      <ProfilePhoto
        width={50}
        height={50}
        profilePhoto={comment.user.profile_photo}
      />
      <Layout style={{ ...styles.commentContent, flex: 1 }}>
        <Text style={{ ...theme.boldText }}>{comment.user.name}</Text>
        <Text style={{ paddingVertical: 5 }}>{comment.content}</Text>
        <Layout
          style={{ ...theme.flexDirectionRow, justifyContent: "space-between" }}
        >
          <Moment
            locale={localization.locale || "ru"}
            element={Text}
            style={{ fontSize: 13, color: "gray" }}
            fromNow
          >
            {comment.createdAt}
          </Moment>
          <Layout>
            <TouchableWithoutFeedback onPress={setLike}>
              <Layout
                style={{
                  ...theme.flexDirectionRow,
                  alignItems: "center",
                  paddingLeft: 5,
                }}
              >
                <Icon
                  style={styles.icon}
                  fill={liked ? "#ed4956" : "#262626"}
                  name={liked ? "heart" : "heart-outline"}
                />
                <Text style={{ paddingLeft: 2 }}>{likes}</Text>
              </Layout>
            </TouchableWithoutFeedback>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

const Comments = ({ route, auth }: Props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [loadMoreData, setLoadMoreData] = useState({
    page: 1,
    limit: 9,
    offset: null,
    size: 9,
  });
  const { postId } = route.params;

  const fetchComments = (page: number) => {
    getComments(postId, { page }).then((data: any) => {
      if (!data.err) {
        const { comments: incomingComments, page, limit, offset, size } = data;
        setComments([...comments, ...incomingComments]);
        setLoading(false);
        setRefreshing(false);
        setIsLoadMore(false);
        setLoadMoreData({ page, limit, offset, size });
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLoadMoreData({ page: 1, limit: 9, offset: null, size: 9 });
    fetchComments(1);
  }, []);

  useEffect(() => {
    fetchComments(1);
  }, []);

  const submit = async () => {
    if (value.length < 1) return;

    const response = await createComment(postId, value);

    console.log(response);
  };

  const loadMoreComments = () => {
    if (loadMoreData.size === loadMoreData.limit) {
      fetchComments(Number(loadMoreData.page) + 1);
      setIsLoadMore(true);
    }
  };

  const renderItem = (comment: any) => {
    return <Comment {...{ ...comment }} />;
  };

  return (
    <Layout style={{ flex: 1 }}>
      <TopBar title={localization.t("comments")} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Layout style={{ flex: 1 }}>
            <FlatList
              data={comments}
              renderItem={renderItem}
              keyExtractor={(item: any) => item.id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReachedThreshold={0.4}
              onEndReached={loadMoreComments}
              ListFooterComponent={
                isLoadMore ? (
                  <Layout
                    style={{
                      justifyContent: "center",
                      flexDirection: "row",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Spinner />
                  </Layout>
                ) : null
              }
            />
          </Layout>

          <Layout style={styles.inputContainer} level="2">
            <ProfilePhoto width={40} height={40} />
            <Input
              value={value}
              style={{
                borderColor: "transparent",
                alignSelf: "stretch",
                backgroundColor: "transparent",
                flex: 1,
              }}
              placeholder={localization.t("addComment")}
              onChangeText={(nextValue) => setValue(nextValue)}
            />
            <TouchableOpacity onPress={submit}>
              <Text status="primary">{localization.t("sendComment")}</Text>
            </TouchableOpacity>
          </Layout>
        </>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ userReducer }: { userReducer: { auth: any } }) => {
  return { auth: userReducer.auth };
};

export default connect(mapStateToProps)(Comments);
