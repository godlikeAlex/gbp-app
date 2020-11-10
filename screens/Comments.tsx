import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  View,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { bindActionCreators } from "redux";
import TopBar from "../src/components/TopBar";
import { Layout, Input, Icon, Text, Spinner, Modal, List, ListItem, Divider } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/ProfileNavigator";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { createComment, getComments, getPhoto, removeComment, toggleLike } from "../core/api";
import { ProfilePhoto } from "../src/components";
import { StyleGuide, theme } from "../src/components/StyleGuide";
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
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  Post: {
    user: {
      id: number
    }
  }
  createdAt: string;
  onDelete: (id: number) => void;
}

export const Comment = ({ item: comment, auth, onDelete }: { item: CommentProps, auth: any }) => {
  const [liked, setLiked] = useState(comment.isLiked);
  const [likes, setLikes] = useState(comment.likes);
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  const ownerItems = [
    {
      title: localization.t('removecomment'),
      onPress: () => {
        removeComment(comment.id).then((data) => {
          setVisible(false);
          if(data.status === 'ok') {
            onDelete(comment.id)
          }
        })
      }
    },
    // {
    //   title: 'Copy',
    //   onPress: () => {
    //     console.log(true)
    //   }
    // }
  ]

  const defaultItems = [
    {
      title: 'Copy post',
      onPress: () => {
        console.log(true)
      }
    },
    // {
    //   title: 'Unfollow',
    //   onPress: () => {
    //     console.log(true)
    //   }
    // }
  ]

  const setLike = () => {
    setLiked((isLiked) => !isLiked);

    setLikes((likes) => {
      toggleLike(comment.id, "comment");
      if (liked) return likes - 1;
      else return likes + 1;
    });
  };

  const renderModalItem = ({ item, index }) => (
    <ListItem
      title={() => <Text style={{fontSize: 18}}>{item.title}</Text>}
      onPress={item.onPress}
    />
  );

  return (
    <>
      <TouchableHighlight onLongPress={() => setVisible(true)} >
        <Layout style={styles.commentContainer}>
          <TouchableWithoutFeedback onPress={() => navigation.navigate("UserScreen", {userId: comment.user.id})}>
                  <View
                    style={{
                      // ...theme.flexDirectionRow,
                      alignItems: "center",
                      paddingLeft: 5,
                    }}
                  >
                    <ProfilePhoto
                      width={50}
                      height={50}
                      profilePhoto={comment.user.profile_photo ? getPhoto(comment.user.profile_photo): undefined}
                    />
                  </View>
          </TouchableWithoutFeedback>
          <View style={{ ...styles.commentContent, flex: 1 }}>
            <Text style={{ ...theme.boldText }}>{comment.user.name}</Text>
            <Text style={{ paddingVertical: 5 }}>{comment.content}</Text>
            <View
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
              <View>
                <TouchableWithoutFeedback onPress={setLike}>
                  <View
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
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </Layout>
      </TouchableHighlight>

      <View>
        <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}>
          <Layout style={{borderRadius: 150}}>
            <List
              style={{width: 350, marginHorizontal: 0}}
              data={
                comment.Post.user.id === auth.user.id || auth.user.id === comment.user.id ? 
                ownerItems : defaultItems
              }
              ItemSeparatorComponent={Divider}
              renderItem={renderModalItem}
            />
          </Layout>
        </Modal>
      </View>
    </>
  );
};

  const Comments = ({ route, auth, myProfile}: Props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<CommentProps[]>([]);
  const [state, setState] = useState({
    isLoadMore: true,
    refreshing: true,
    dataIsLoading: false,
    page: 1,
    limit: 9,
    offset: null,
    size: 9,
  });

  const {isLoadMore, refreshing, dataIsLoading, page, limit, offset, size} = state;

  const { postId } = route.params;

  const fetchComments = (page: number, initial: boolean = false) => {
    getComments(postId, { page }).then((data: any) => {
      if (!data.err) {
        const { comments: incomingComments, limit, offset, size } = data;
        if (initial) {
          setLoading(false);
          setComments(incomingComments);
          setState({
            ...state,
            refreshing: false,
            dataIsLoading: false,
            isLoadMore: size === limit,
            page: 1,
            limit,
            size,
            offset
          });
        } else {
          setComments(comments => [...comments, ...incomingComments]);
          setState({
            ...state,
            refreshing: false,
            dataIsLoading: false,
            isLoadMore: size === limit,
            page,
            limit,
            size,
            offset
          });
        }
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setState({...state, refreshing: true});
    fetchComments(1, true);
  }, []);

  useEffect(() => {
    fetchComments(1, true);
  }, []);

  const submit = async () => {
    if (value.length < 1) return;
    
    setValue('');

    const response = await createComment(postId, value);

    if (response.status === 'ok') {
      setComments([
        {
          ...response.comment,
          user: auth.user,
          Post: {
            user: auth.user
          }
        },
         ...comments
      ]);
    }
  };

  const loadMoreComments = () => {
    if(!dataIsLoading) {
      if (size === limit) {
        setState({
          ...state,
          isLoadMore: true,
          dataIsLoading: true
        })
        fetchComments(Number(page) + 1, false);
      }
    }
  };

  const renderItem = useCallback(({item}: any) => (
    <Comment {...{auth, item}} onDelete={(id: number) => setComments(comments => comments.filter(comment => comment.id !== id))} />
  ), []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <Layout style={{ flex: 1 }}>
      <TopBar title={localization.t("comments")} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Layout style={{ flex: 1 }}>
            <FlatList
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              data={comments}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              onEndReachedThreshold={0.5}
              onEndReached={loadMoreComments}
              ListFooterComponent={
                isLoadMore && (
                  <View
                    style={{
                      paddingVertical: 15,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {/* <LoadingSpinner /> */}
                    <ActivityIndicator />
                  </View>
                )
              }
            />
          </Layout>

          <Layout style={styles.inputContainer} level="2">
            <ProfilePhoto width={40} height={40} profilePhoto={auth.user.profile_photo ? getPhoto(auth.user.profile_photo): undefined} />
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

const mapStateToProps = ({ userReducer }: { userReducer: { auth: any, myProfile: any } }) => {
  const {auth, myProfile} = userReducer;
  return {auth, myProfile};
};

const mapDispatchToProps = (dispatch: any) => {
  const { removePost } = bindActionCreators(actions, dispatch);

  return {
    removePost
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Comments);
