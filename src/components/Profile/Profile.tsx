import React, { useEffect, useRef, useState } from "react";
import { Layout } from "@ui-kitten/components";
import { ScrollView, TouchableHighlight, View, Image, Dimensions, RefreshControl, StyleSheet, BackHandler } from "react-native";
import { getPhoto, getProfilePosts } from "../../../core/api";
import LoadingSpinner from "../LoadingSpinner";
import ProfileInfo from "../ProfileInfo";
import * as actions from "../../../redux/actions";

import { Transitioning, Transition, TransitioningView } from 'react-native-reanimated';
import TopBar from "../TopBar";
import FeedProfilePosts from "../FeedProfilePosts";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    zIndex: 3, 
    top: 0, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2
  }
})

interface ProfileProps {
  profileInfo: any;
  buttons: any[];
  refreshing: boolean;
  onRefresh: any;
  posts: any;
  loadMorePosts: (payload: any) => void
  navigation: any;
}

const Profile = ({ profileInfo, buttons, refreshing, onRefresh, posts: allPosts, loadMorePosts, navigation }: ProfileProps) => {
  const ref = useRef<TransitioningView>();
  const posts = allPosts[profileInfo.id] || {};
  const postItems = posts.data || [];
  const [state, setState] = useState({
    limit: 9,
    page: 1,
    size: postItems.length
  });
  const [detailsPosts, setDetailsPosts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  useEffect(() => setState({limit: 9, page: 1, size: postItems.length}), []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log(detailsPosts);
        if (detailsPosts) {
          toggleShowPost();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [detailsPosts])
  );

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    const paddingToBottom = height * 0.6;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  const recyclerRef = useRef<any>();

  const toggleShowPost = (idx?:number) => {
    if(idx !== undefined) {
      recyclerRef.current?.scrollToIndex({index: idx, animated: false})
    };
    ref.current?.animateNextTransition();
    setDetailsPosts(t => !t);
  };

  const loadMore = () => {
    if (!loadingMore) {
      if (state.limit === state.size) {
        setLoadingMore(true);
        loadMoreData().then(() => setLoadingMore(false));
      }
    }
  }

  const loadMoreData = () => {
    return new Promise(resolve => {
      getProfilePosts(profileInfo.id, {page: Number(state.page) + 1}).then((data) => {
        if (!data.error) {
          const {posts, limit, page, size} = data;
          setState({
            page,
            limit,
            size
          });
          loadMorePosts({id: profileInfo.id, posts});
          resolve();
        }
      });
    })
  };


  const postItem = (post: any, index: number) => (
    <View key={index} style={{ width: width / 3, height: width / 3, marginBottom: 3, paddingLeft: index % 3 !== 0 ? 3 : 0}}>
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#000"
      onPress={() => toggleShowPost(index)}
    >
      <View>
        <Image
          source={{ uri: getPhoto(post.content[0].uri) }}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
    </TouchableHighlight>
  </View>
  );

  const transition = <Transition.Change interpolation="easeInOut" durationMs={100}  />;
  
  return (
    <>
    {detailsPosts && (<TopBar title='Posts' style={styles.topBar} onBackAction={() => toggleShowPost()} />)}
    
    <Transitioning.View
      ref={ref}
      transition={transition}
      style={{ flex: 1}}
    >
      <View
        style={{
          zIndex: 2, 
          position: 'absolute', 
          width: '100%', 
          height: '100%', 
          backgroundColor: 'white', 
          left: detailsPosts ? undefined : '100%',
          
        }}
      >
        <FeedProfilePosts 
          posts={postItems} 
          withScrollTo={true} 
          hasNextPage={state.limit === state.size}
          {...{loadMoreData, recyclerRef}}
        />
      </View>

        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMore();
          }
        }}
        contentContainerStyle={{minHeight: '100%'}}
        scrollEventThrottle={20}
      >
        <ProfileInfo profile={profileInfo} buttons={buttons} />
        {posts.initialLoading === undefined ? (<Layout style={{flex: 1, borderTopColor: '#e1e1e1', borderTopWidth: 1}} level='2'>
          <LoadingSpinner />
        </Layout>): (
        <Layout style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {postItems.map(postItem)}
          </Layout>
        )}
        {loadingMore && (
          <Layout>
            <LoadingSpinner />
          </Layout>
        )}
      </ScrollView>
    </Transitioning.View>
    </>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  const {posts} = state.userReducer;
  return {
    posts,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { loadMorePosts } = bindActionCreators(actions, dispatch);

  return {
    loadMorePosts
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
