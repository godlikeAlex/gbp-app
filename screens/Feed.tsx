import { Layout } from '@ui-kitten/components';
import React, { useState } from 'react';
import {StyleSheet, View} from 'react-native';
import { getMyFeed } from '../core/api';
import { FeedProfilePosts } from '../src/components';
import LoadingSpinner from '../src/components/LoadingSpinner';
import TopBar from '../src/components/TopBar';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface FeedProps {}

const Feed = ({}: FeedProps) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    posts: [],
    size: 0,
    limit: 9,
    page: 1
  });

  React.useEffect(() => {
    // change in server post.
    getMyFeed({page: 1}).then(data => {
      if(!data.error) {
        setState(data);
        setLoading(false);
      }
    });
  }, []);

  const loadMoreData = () => {
    return new Promise(resole => {
      getMyFeed({page: Number(state.page) + 1}).then(data => {
        if(!data.error) {
          resole();
          console.log(data);
          setState({
            ...data,
            posts: [...state.posts, ...data.posts],
          });
        }
      });
    })
  }

  return <Layout style={{flex: 1}}>
    {loading ? <LoadingSpinner /> : (
      <FeedProfilePosts posts={state.posts} loadMoreData={loadMoreData} hasNextPage={state.size === state.limit}  />
    )}
  </Layout>
};

export default Feed