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
import { Text, Layout, Avatar, Icon } from "@ui-kitten/components";
import { StyleGuide, theme } from "../StyleGuide";
import { getPhoto, toggleLike as toggleLikeApi } from "../../../core/api";
import ProfilePhoto from "../ProfilePhoto";
import { useNavigation } from "@react-navigation/native";
import localization from "../../../services/localization";
import Moment from "react-moment";
import "moment/locale/ru";
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: StyleGuide.spacing,
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
}

export default ({
  id,
  user,
  isLiked,
  likes_count,
  content,
  description,
  createdAt,
}: PostProps) => {
  const navigation = useNavigation();
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState<number>(Number(likes_count));
  const [index, setIndex] = useState(0);
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

  return (
    <Layout style={styles.container} level="1">
      <View style={styles.userInfo}>
        <ProfilePhoto
          profilePhoto={user.profile_photo}
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
  );
};
