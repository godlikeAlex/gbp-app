import { Layout, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import { getChats } from '../core/api';
import { socket } from '../core/socket';
import { UserProfileListItem } from '../src/components';
import LoadingSpinner from '../src/components/LoadingSpinner';
import { StyleGuide } from '../src/components/StyleGuide';
import TopBar from '../src/components/TopBar';

import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { bindActionCreators } from "redux";
import { StackNavigationProp  } from '@react-navigation/stack';


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface DirectScreenProps {
  navigation: StackNavigationProp<any>;
  selectedContact: any;
  contacts: any[];

  initContacts: (payload: {contacts: any[]}) => void;
  selectContact: (payload: {contact: any}) => void;
}

const MessageCounter = ({count}: {count: number | string}) => (
  <View 
    style={{
      backgroundColor: 'rgb(0, 149, 255)', 
      borderRadius: 150, 
      width: 30, 
      height: 30,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  ><Text style={{color: 'white', fontWeight: 'bold'}}>{count}</Text></View>
)

const DirectScreen = ({navigation, selectedContact, contacts, initContacts, selectContact}: DirectScreenProps) => {
  const [state, setState] = useState({
    loading: true,
    page: 1,
    size: 9,
    limit: 9,
    loadMoreLoading: false
  });

  // const {categoryId, categoryName} = route.params;

  useEffect(() => {
    getChats().then(data => {
      if(!data.error) {
        const {chats, limit, size, page} = data;
        initContacts({contacts: chats});
        setState({
          ...state,
          limit,
          size,
          page,
          loading: false,
        })
      }
    })
  }, []);

  const renderItem = ({item}: any) => {
    return (
      <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1}}>
        <UserProfileListItem 
          {...{...item.user}} 
          onPress={() => {
            selectContact({contact: item});
            navigation.navigate('Messages');
            // selectContact({contact: null});
            // setTimeout(() => {
            //   selectContact({contact: item});
            //   navigation.navigate('Messages');
            // }, 5100)
          }} 
          accessoryRight={item.unread > 0 && <MessageCounter count={item.unread > 0 && item.unread} />} 
          showOnline={item.isOnline}
        />
        </View>
      </View>
    )
  };

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  // const renderFooter = () => (
  //   state.loadMoreLoading ? <View><ActivityIndicator size='large' /></View> : null
  // );

  // const onEndReached = () => {
  //   if(!state.loadMoreLoading) {
  //     if(state.size === state.limit) {
  //       setState({...state, loadMoreLoading: true});
  //       // getUsersByCategory(categoryId, {page: Number(state.page) + 1}).then((data) => {
  //       //   if(!data.error) {
  //       //     setState({
  //       //       ...state,
  //       //       ...data,
  //       //       loadMoreLoading: false,
  //       //     })
  //       //   }
  //       // })
  //     }
  //   }
  // }

  return <Layout style={{flex: 1}}>
    <TopBar title="Messages" />
    {state.loading ? <LoadingSpinner /> : (
      <>
        <FlatList
          data={contacts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          // onEndReached={onEndReached}
          onEndReachedThreshold={2}
          // ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
        />
      </>
    )}
  </Layout>
};


const mapStateToProps = ({ messanger }: { messanger: { selectedContact: any, contacts: [] } }) => {
  const {selectedContact, contacts} = messanger;
  return {selectedContact, contacts};
};

const mapDispatchToProps = (dispatch: any) => {
  const { initContacts, selectContact } = bindActionCreators(actions, dispatch);

  return {
    initContacts,
    selectContact
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DirectScreen);