import React, { Ref, useCallback, useEffect, useRef } from 'react';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { RecyclerListViewProps } from 'recyclerlistview/dist/reactnative/core/RecyclerListView';
import LoadingSpinner from '../LoadingSpinner';
import Post from '../Post';

const {width} = Dimensions.get('window');

interface FeedProfilePostsProps {
  posts: any[];
  recyclerRef?: any;
  withScrollTo?: boolean;
  loadMoreData: () => void;
  hasNextPage: boolean;
  renderHeader?: React.FC
}

const FeedProfilePosts = ({posts, recyclerRef, renderHeader, withScrollTo, loadMoreData, hasNextPage}: FeedProfilePostsProps) => {
  const [showLoadMore, setShowLoadMore] = React.useState(true);
  const _renderRow = useCallback(({item}: any) => (
    <Post {...item} />
  ), []);
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // const _layoutProvider = new LayoutProvider(
  //   index => {
  //     return 0;
  //   },
  //   (type, dim) => {
  //     dim.width = width;
  //     dim.height = 500;
  //   }
  // );

  // let dataProvider = new DataProvider((r1, r2) => {
  //   return r1 !== r2
  // });

  // const data = dataProvider.cloneWithRows(posts);

  const renderFooter = () => (
    showLoadMore ? <View><ActivityIndicator size='large' /></View> : null
  );

  const onEndReached = () => {
    if(hasNextPage) {
      setShowLoadMore(true)
      loadMoreData().then(() => {
        setShowLoadMore(true);
      })
    } else {
      setShowLoadMore(false);
    }
  }

  return (
    posts.length > 0 ? (
      // renderAheadOffset={6000}
      // <RecyclerListView 
      //   ref={recyclerRef} 
      //   // renderAheadOffset={withScrollTo ? posts.length * 500 / 2 : undefined}  
      //   layoutProvider={_layoutProvider} 
      //   dataProvider={data}
      //   rowRenderer={_renderRow}
      //   {...{renderFooter, onEndReached}}
      //   onEndReachedThreshold={400}
      //   forceNonDeterministicRendering={true}
      // />
      <FlatList
        ref={recyclerRef}
        data={posts}
        renderItem={_renderRow}
        keyExtractor={keyExtractor}
        maxToRenderPerBatch={4}
        onEndReached={onEndReached}
        onEndReachedThreshold={2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListHeaderComponent={renderHeader}
        initialNumToRender={2}
      />
    ) : null
  )
};

export default FeedProfilePosts;