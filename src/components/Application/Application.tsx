import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import { authSocket, socket } from '../../../core/socket';
import AppNavigator from '../../../navigation/AppNavigator';

import { connect } from "react-redux";
import * as actions from "../../../redux/actions";
import { bindActionCreators } from "redux";
import { ChatContact, Message } from '../../../redux/types';


const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface AppProps {
  auth: any;
  selectedContact: ChatContact;
  contacts: ChatContact[];

  addNewMessage: (payload: {message: Message}) => void;
  updateBadgeInDirect: (payload: {id: number}) => void;
  markMessagesAsRead: (payload: {userId: number, chatId: number}) => void;
  updateOnlineSelectedContact: (payload: {online: boolean}) => void;
  updateOnlineStatusInContacts: (payload: {id: number, online: boolean}) => void;
  addNewChat: (payload: {contact: any}) => void;
}

const Application = ({auth, contacts, addNewChat, selectedContact, updateOnlineStatusInContacts, addNewMessage, updateBadgeInDirect, markMessagesAsRead, updateOnlineSelectedContact}: AppProps) => {
  const [socketLoaded, setSocketLoaded] = useState(false);
  useEffect(() => {
    if (auth.token) {
      authSocket(auth.token);
      setSocketLoaded(true);
    }
  }, [auth]);

  useEffect(() => {    
    if(socketLoaded) {
      const messageHandler = (message: Message) => {
        if (selectedContact && selectedContact.user.id === message.from) {
          addNewMessage({message});
          socket.imReadedMessages(selectedContact.user.id, selectedContact.id);
        } else {
          updateBadgeInDirect({id: message.chatId});
        }
      };
  
      const messageReadedHandler = (data: any) => {
        if (selectedContact && selectedContact.id === data.chatId) {
          markMessagesAsRead(data);
        }
  
      };
  
      const onNewUserConnectedHandler = (data: {online: boolean, id: number}) => {
        if(selectedContact && selectedContact.user.id === data.id) {
          updateOnlineSelectedContact({online: data.online})
        }
  
        if (contacts.find(contact => contact.user.id === data.id)) {
          updateOnlineStatusInContacts(data);
        }
      }
  
      const onNewChatCreatedHandler = ({message, chat}: {message: Message, chat: ChatContact}) => {
        addNewChat({contact: chat});
      }
  
      if(auth.token) {
        socket.onMessage(messageHandler);
        socket.onMessageReaded(messageReadedHandler);
        socket.onNewUserConnected(onNewUserConnectedHandler);
        socket.onNewChatCreated(onNewChatCreatedHandler);
      }
  
      return () => {
        socket.off('newMessage', messageHandler);
        socket.off('messageReaded', messageReadedHandler);
        socket.off('onlineUserUpdated', onNewUserConnectedHandler);
        socket.off('newChatCreated', onNewChatCreatedHandler);
      }
    }
  }, [auth, selectedContact, socketLoaded]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  )
};

const mapStateToProps = ({userReducer, messanger}: { userReducer: any, messanger: any }) => {
  const {selectedContact, contacts} = messanger;
  return {
    auth: userReducer.auth,
    selectedContact,
    contacts
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { addNewMessage, updateBadgeInDirect, markMessagesAsRead, addNewChat, updateOnlineStatusInContacts, updateOnlineSelectedContact } = bindActionCreators(actions, dispatch);

  return {
    addNewMessage,
    updateBadgeInDirect,
    markMessagesAsRead,
    updateOnlineSelectedContact,
    updateOnlineStatusInContacts,
    addNewChat
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Application);