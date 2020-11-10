import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Layout } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { getUsersByCategory } from '../core/api';
import { MainStackParamList } from '../navigation/MainStack';
import { UserProfileListItem } from '../src/components';
import LoadingSpinner from '../src/components/LoadingSpinner';
import TopBar from '../src/components/TopBar';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

type UserCategoryScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  "UsersByCategory"
>;
type UserCategoryScreenRouteProp = RouteProp<MainStackParamList, "UsersByCategory">;

interface UsersByCategoryProps {
  navigation: UserCategoryScreenNavigationProp;
  route: UserCategoryScreenRouteProp;
}

const UsersByCategory = ({route}: UsersByCategoryProps) => {
  const [state, setState] = useState({
    loading: true,
    page: 1,
    size: 9,
    limit: 9,
    users: [],
    loadMoreLoading: false
  });
  const {categoryId, categoryName} = route.params;

  useEffect(() => {
    getUsersByCategory(categoryId, {page: state.page}).then(data => {
      if(!data.error) {
        setState({
          ...state,
          ...data,
          loading: false,
        })
      }
    })
  }, []);

  const renderItem = ({item}: any) => {
    return <UserProfileListItem {...{...item}} />
  };

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const renderFooter = () => (
    state.loadMoreLoading ? <View><ActivityIndicator size='large' /></View> : null
  );

  const onEndReached = () => {
    if(!state.loadMoreLoading) {
      if(state.size === state.limit) {
        setState({...state, loadMoreLoading: true});
        getUsersByCategory(categoryId, {page: Number(state.page) + 1}).then((data) => {
          if(!data.error) {
            setState({
              ...state,
              ...data,
              loadMoreLoading: false,
            })
          }
        })
      }
    }
  }

  return (
    <Layout style={{flex: 1}}>
      <TopBar title={categoryName} />
      {state.loading ? <LoadingSpinner /> : (
        <>
          <FlatList
            data={state.users}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onEndReached={onEndReached}
            onEndReachedThreshold={2}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </Layout>
  )
};

export default UsersByCategory