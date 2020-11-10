import { Layout } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getCategories, getMyFeed } from '../core/api';
import { socket } from '../core/socket';
import { FeedProfilePosts } from '../src/components';
import LoadingSpinner from '../src/components/LoadingSpinner';
import { StyleGuide } from '../src/components/StyleGuide';
import TopBar from '../src/components/TopBar';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface FeedProps {}

const Feed = ({navigation}: FeedProps) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    posts: [],
    size: 0,
    limit: 9,
    page: 1
  });
  const [categories, setCategories] = useState(new Array(9).fill(''));

  React.useEffect(() => {
    // change in server post.
    getMyFeed({page: 1}).then(data => {
      if(!data.error) {
        setState(data);
        setLoading(false);
      }
    });

    getCategories('en').then(data => {
      if (data.categories) {
        setCategories(data.categories);
      }
    })
  }, []);

  const loadMoreData = () => {
    return new Promise(resole => {
      getMyFeed({page: Number(state.page) + 1}).then(data => {
        if(!data.error) {
          resole();
          setState({
            ...data,
            posts: [...state.posts, ...data.posts],
          });
        }
      });
    })
  }

  const renderHeader = () => (
    <View style={{ borderBottomColor: '#3333336e', borderWidth: 0.3}}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: StyleGuide.spacing,}}>
        {categories.map((category, i) => (
          <TouchableOpacity key={category.id} onPress={() => navigation.navigate('UsersByCategory', {categoryId: category.categoryId, categoryName: category.name})}>
            <View style={{ justifyContent: 'center', alignItems: 'center',  marginRight: i === categories.length - 1 ? 0 : StyleGuide.spacing, width: 75}}>
              <Layout style={{ width: 75, height: 75, borderRadius: 65, backgroundColor: category.color,  }} />
              <Text style={{fontSize: 13}}>{category.name.substring(0, 10) }</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )

  return <Layout style={{flex: 1}}>
    {loading ? <LoadingSpinner /> : (
      <>
        <TopBar title={'Feed'} />
        <FeedProfilePosts renderHeader={renderHeader} posts={state.posts} loadMoreData={loadMoreData} hasNextPage={state.size === state.limit}  />
      </>
    )}
  </Layout>
};

export default Feed