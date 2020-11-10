import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../../../redux/actions";
import { bindActionCreators } from "redux";
import { Text, Layout, Avatar, Icon, Modal, Card, Button, ListItem, Divider, List } from "@ui-kitten/components";
import { StyleGuide, theme } from "../StyleGuide";
import { getPhoto, removePost, toggleLike as toggleLikeApi } from "../../../core/api";
import ProfilePhoto from "../ProfilePhoto";
import { useNavigation } from "@react-navigation/native";
import localization from "../../../services/localization";
import Moment from "react-moment";
import "moment/locale/ru";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: StyleGuide.spacing * 0.5,
  },
  userName: {
    marginLeft: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationItem: {
    width: 8,
    height: 8,
    backgroundColor: "grey",
    borderRadius: 50,
    marginLeft: 5,
    marginVertical: StyleGuide.spacing * 0.2,
  },
  activePagenation: {
    width: 10,
    height: 10,
    backgroundColor: "purple",
  },
  icon: {
    width: 30,
    height: 30,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export interface PostProps {
  id: number;
  description: string;
  comments: Array<any>;
  content: Array<any>;
  user: any;
  isLiked: boolean;
  likes_count: string | number;
  createdAt: string;

  // redux
  auth: any;

  removePost: (payload: {userId: string | number, postId: string | number}) => void; 
}

const Post = ({
  id,
  user,
  isLiked,
  likes_count,
  content,
  description,
  createdAt,
  auth,
  removePost: removePostFromState
}: PostProps) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState<number>(Number(likes_count));
  const [index, setIndex] = useState(0);

  const ownerItems = [
    {
      title: localization.t('removepost'),
      onPress: () => {
        removePost(id).then((data) => {
          if(data.status === 'ok') {
            removePostFromState({userId: user.id, postId: id})
          }
        })
      }
    },
    {
      title: localization.t('copypost'),
      onPress: () => {
        console.log(true)
      }
    }
  ]

  const defaultItems = [
    {
      title: localization.t('copypost'),
      onPress: () => {
        console.log(true)
      }
    }
  ]

  const [visible, setVisible] = React.useState(false);
  const indexRef = useRef(index);
  indexRef.current = index;
  const onScroll = useCallback((event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);

    const distance = Math.abs(roundIndex - index);

    const isNoMansLand = 0.4 < distance;

    if (roundIndex !== indexRef.current && !isNoMansLand) {
      setIndex(roundIndex);
    }
  }, []);

  useEffect(() => {}, [index]);

  const toggleLike = () => {
    setLiked((isLiked) => !isLiked);

    setLikes((likes) => {
      toggleLikeApi(id);
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
    <Layout style={styles.container} level="1">
        <Layout style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: StyleGuide.spacing,}}>
        <TouchableWithoutFeedback
            onPress={() => navigation.navigate("UserScreen", {userId: user.id})}
          >
            <View style={styles.userInfo}>
                <ProfilePhoto
                  profilePhoto={user.profile_photo ? getPhoto(user.profile_photo): undefined}
                  width={40}
                  height={40}
                />
                <View
                  style={{
                    ...styles.userName,
                    flexDirection: "column",
                  }}
                >
                  <Text style={{ ...theme.text, ...theme.boldText }}>
                    {user.account_name}
                  </Text>
                  <Moment
                    locale={localization.locale || "ru"}
                    element={Text}
                    style={{ ...theme.text, fontSize: 13, color: "gray" }}
                    fromNow
                  >
                    {createdAt}
                  </Moment>
                </View>
              </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>setVisible(true)}>
            <Icon fill='#333' name="more-vertical" style={{width: 25, height: 25}} />
          </TouchableWithoutFeedback>
        </Layout>

      {/* Slider */}

      <View style={{ marginBottom: 5 }}>
        <FlatList
          data={content}
          renderItem={({ item, index, separators }) => (
            <View key={index}>
              <View
                style={{
                  height: 350,
                  width,
                }}
              >
                <Image
                  source={{ uri: getPhoto(item.uri) }}
                  style={{ width: "100%", height: "100%" }}
                />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
        />
      </View>
      <View style={styles.paginationContainer}>
        {content.length > 1 &&
          content.map((_, i) => (
            <View
              style={[
                styles.paginationItem,
                i === index && styles.activePagenation,
              ]}
              key={i}
            ></View>
          ))}
      </View>
      {/* Slider end */}
      <View
        style={{
          ...StyleGuide.padding.horizontal,
          ...theme.flexDirectionRow,
        }}
      >
        <TouchableWithoutFeedback onPress={() => toggleLike()}>
          <Icon
            style={styles.icon}
            fill={liked ? "#ed4956" : "#262626"}
            name={liked ? "heart" : "heart-outline"}
          />
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => navigation.navigate("Comments", { postId: id })}
        >
          <Icon
            style={{ ...styles.icon, marginLeft: 10 }}
            fill="#262626"
            name="message-circle-outline"
          />
        </TouchableOpacity>
      </View>
      <View style={{ ...StyleGuide.padding.horizontal, paddingTop: 10 }}>
        <Text style={theme.boldText}>
          {likes} {localization.t("likes")}
        </Text>
        <View
          style={{
            ...theme.flexDirectionRow,
          }}
        >
          <Text>
            <Text style={theme.boldText}>{user.account_name}: </Text>
            {description}
          </Text>
        </View>
      </View>
    </Layout>
    <View>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Layout style={{borderRadius: 150}}>
          <List
            style={{width: 350, marginHorizontal: 0}}
            data={auth.user.id === user.id ? ownerItems : defaultItems}
            ItemSeparatorComponent={Divider}
            renderItem={renderModalItem}
          />
        </Layout>
      </Modal>
    </View>
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  const {auth} = state.userReducer;
  return {
    auth,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { removePost } = bindActionCreators(actions, dispatch);

  return {
    removePost
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);