import { Icon, Layout, Spinner, Input } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';
import {ActivityIndicator, FlatList, Platform, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import { searchUsers } from '../core/api';
import { UserProfileListItem } from '../src/components';
import { StyleGuide } from '../src/components/StyleGuide';
import localization from '../services/localization';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

interface SearchScreenProps {}

const SearchScreen = ({}: SearchScreenProps) => {
  const [input, setInput] = useState('');
  const [state, setState] = useState({
    loading: true,
    page: 1,
    size: 9,
    limit: 9,
    users: [],
    loadMoreLoading: false,
    searcing: false
  });

  const handleChange = (text: string) => {
    setInput(text);

    if(text.length > 2) {
      setState({
        ...state,
        searcing: true
      });

      searchUsers({page: 1, term: text}).then(data => {
        if (!data.error) {
          setState({
            ...state,
            ...data,
            searcing: false
          });
        }
      })
    }
  };

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
        searchUsers({page: Number(state.page) + 1, term: input}).then((data) => {
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
    <Layout style={styles.container}>
      <Layout style={{padding: StyleGuide.spacing}}>
        <Input value={input} onChangeText={handleChange} placeholder={localization.t('search')} style={{fontSize: 16}} />
      </Layout>
      {state.searcing ? (
        <Layout style={{ alignItems: 'center', flexDirection: 'row', paddingHorizontal: StyleGuide.spacing}}>
          <Spinner size="small" />
          <Text style={{margin: 10}}>{localization.t('searching')}</Text>
        </Layout>
      ): (
        <FlatList
          data={state.users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={onEndReached}
          onEndReachedThreshold={2}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Layout>
  )
};

export default SearchScreen