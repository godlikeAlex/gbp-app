import { Icon, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useCallback, useEffect, useState } from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, TextInput as Input, ActivityIndicator} from 'react-native';
import { ProfilePhoto } from '../src/components';
import LoadingSpinner from '../src/components/LoadingSpinner';
import TopBar from '../src/components/TopBar';
import localization from '../services/localization';
import { StyleGuide } from '../src/components/StyleGuide';
import { createChat, getMessages, getPhoto, sendMessage } from '../core/api';
import { connect } from 'react-redux';
import Moment from "react-moment";
import {ChatContact, Message, MessangerState} from '../redux/types';
import "moment/locale/ru";
import { bindActionCreators } from 'redux';
import * as actions from "../redux/actions";
import { StackNavigationProp } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    marginHorizontal: 16,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    ...StyleGuide.padding.horizontal,
      alignSelf: "stretch",
      paddingBottom: 10,
      paddingTop: 10
  },
});

const RenderTitle = ({title, profilePhoto, isOnline}: {title: string; profilePhoto?: string, isOnline: boolean}) => (
  <View style={styles.titleContainer}>
    <ProfilePhoto width={45} height={45} profilePhoto={profilePhoto ? getPhoto(profilePhoto) : undefined} onlineBadge={isOnline}  />
    <Text style={{marginLeft: 10}}>{title}</Text>
  </View>
);

interface MessageScreenProps {
  navigation: StackNavigationProp<any>;
  selectedContact: ChatContact;
  messages: Message[];
  initMessages: (payload: {messages: Message[]}) => void;
  loadMoreMessages: (payload: {messages: Message[]}) => void;
  addNewMessage: (payload: {message: Message}) => void;
  aNullBadgeInDirect: (payload: {id: number}) => void;
  selectContact: (payload: {contact: any}) => void;
  addNewChat: (payload: {contact: any}) => void;
  auth: any;
}

interface StateProps {
  loading: boolean, 
  isLoadMore: boolean;
  hasNextPage: boolean;
  page: number;
}

const MessageScreen = ({auth, route, navigation, loadMoreMessages, addNewChat, selectContact, selectedContact, messages, initMessages, addNewMessage, aNullBadgeInDirect}: MessageScreenProps) => {
  const [value, setValue] = useState("");
  const [isNewChat, setIsNewChat] = useState(route.params ? route.params.isNewChat : false);
  const [state, setState] = useState<StateProps>({
    loading: true,
    isLoadMore: true,
    hasNextPage: false,
    page: 1
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      selectContact({contact: null});
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const {loading, isLoadMore}:  StateProps  = state;

  const fetchMessages = (page: number, initial: boolean = false) => {
    getMessages(selectedContact && selectedContact.id, page).then((data: any) => {
      if (!data.err) {
        const dataMessages: Message[] = data.messages;
        if (initial) {
          initMessages({messages: dataMessages});
        } else {
          loadMoreMessages({messages: dataMessages});
        }
        setState({
          ...state,
          loading: false,
          hasNextPage: data.hasNextPage,
          isLoadMore: data.hasNextPage,
          page
        });
        aNullBadgeInDirect({id: selectedContact && selectedContact.id});
      }
    });
  };

  useEffect(() => {
    if(isNewChat) {
      setState({
        ...state,
        loading: false,
        isLoadMore: false
      });
      initMessages({messages: []});
    } else {
      fetchMessages(state.page, true);
    }
  }, []);


  const submit = async () => {
    if (value.length < 1) return;

    try {
      if (!isNewChat) {
        setValue('');
        const response = await sendMessage(selectedContact && selectedContact.id, selectedContact && selectedContact.user.id, value);
        addNewMessage({message: response.message});
      } else {
        const {chat, message} = await createChat(selectedContact && selectedContact.user.id, value);
        setValue('');
        addNewMessage({message: message});
        selectContact({contact: {
          ...chat,
          user: selectedContact && selectedContact.user
        }});
        setIsNewChat(false);
        addNewChat({contact: {...chat, user: selectedContact && selectedContact.user}});
      }
    } catch (error) {
      console.log(error);
    }

    // const response = await createComment(postId, value);

    // if (response.status === 'ok') {
    //   fetchComments(1);
    // }
  };

  const loadMoreComments = () => {
    if (state.hasNextPage) {
      fetchMessages(Number(state.page) + 1, false);
    } else {
      setState({
        ...state,
        isLoadMore: false
      });
    }
  };

  const renderItem = ({item: message  }: any) => {
    return (
      <View style={{justifyContent: message.from === auth.user.id ? 'flex-end' : 'flex-start', flexDirection: 'row'}}>
        <Layout 
          level="4" 
          style={{minWidth: 150, maxWidth: 260, marginVertical: StyleGuide.spacing, padding:10, borderRadius: 10, paddingBottom: 30, backgroundColor: message.from === auth.user.id ?'rgb(0, 149, 255)' : '#c1c1c1' }}
        >
          <Text style={{fontSize: 16, color: 'white'}}>{message.text}</Text>
          <View
              style={{ position: 'absolute', right: 10, bottom: 5, flexDirection: 'row', alignItems: 'center'}}
          >
            <Moment
              locale={localization.locale || "ru"}
              element={Text}
              style={{fontSize: 13, color: 'white'}}
              format="MMM D, hh:mm"
            >{message.createdAt}</Moment>
            {message.from === auth.user.id && (
              <View style={{paddingLeft: 5}}>
                <Icon
                  style={{width: 18, height: 18}}
                  fill='white'
                  name={message.read ? 'done-all-outline': 'checkmark-outline'}
                />
              </View>
            )}
          </View>
        </Layout>
      </View>
    )
  };

  const keyExtractor = useCallback((item, i) => {
    return i.toString()
  }, []);

  return <Layout level="2" style={{flex: 1}}>
    <TopBar 
      title={() => <RenderTitle title={selectedContact && selectedContact.user.name} profilePhoto={selectedContact && selectedContact.user.profile_photo} isOnline={selectedContact && selectedContact.isOnline} />}
    />
    {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Layout style={{ flex: 1 }} level="2">
            <FlatList
              inverted
              data={messages}
              // data={[]}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={{...StyleGuide.padding.horizontal}}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              onEndReached={loadMoreComments}
              ListFooterComponent={
                isLoadMore ? (
                  <View style={{marginTop: StyleGuide.spacing}}>
                    <ActivityIndicator />
                  </View>
                ) : null
              }
            />
          </Layout>

          <Layout style={styles.inputContainer} level="2">
            {/* <ProfilePhoto width={40} height={40} profilePhoto={undefined} /> */}
            <Input
              value={value}
              style={{
                backgroundColor: "transparent",
                flex: 1,
                paddingVertical: 10,
                borderColor: '#e5e4e4',
                borderWidth: 1,
                borderRadius: 100,
                paddingLeft: 15
              }}
              placeholder={localization.t("message")}
              onChangeText={(nextValue) => setValue(nextValue)}
            />
            <TouchableOpacity onPress={submit}>
              <Icon name="navigation-outline" style={{width: 30, height: 30, transform: [{ rotate: "90deg" }]}} fill="#8F9BB3" />
            </TouchableOpacity>
          </Layout>
        </>
      )}
  </Layout>
};

const mapStateToProps = ({ userReducer, messanger }: { userReducer: { auth: any, myProfile: any }, messanger: any }) => {
  const {auth, myProfile} = userReducer;
  const {selectedContact, messages} = messanger;
  return {auth, myProfile, selectedContact, messages};
};

const mapDispatchToProps = (dispatch: any) => {
  const { initMessages, addNewChat, loadMoreMessages, selectContact, addNewMessage, aNullBadgeInDirect } = bindActionCreators(actions, dispatch);

  return {
    initMessages,
    addNewMessage,
    aNullBadgeInDirect,
    selectContact,
    addNewChat,
    loadMoreMessages
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);