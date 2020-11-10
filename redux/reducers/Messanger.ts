import {
  INIT_CONTACTS,
  SELECT_CONTACT,
  INIT_MESSAGES,
  ADD_NEW_MESSAGE,
  UPDATE_BADGE_IN_DIRECT,
  ANULL_BADGE_IN_DIRECT,
  MARK_MY_MESSAGES_AS_READ,
  UPDATE_ONSLINE_SELECTED_CONTACT,
  UPDATE_ONSLINE_CONTACT_STATUS,
  ADD_NEW_CHAT,
  INIT_COUNTER,
  LOAD_MORE_MESSAGES,
  // 
  MessangerState,
  ChatContact,
  Message
} from "./../types";

const initialState: MessangerState = {
  selectedContact: null,
  counterMessages: 0,
  contacts: [],
  messages: [],
};

const Messanger = (state: MessangerState = initialState, action: any) => {
  const findContact = () => {
    return state.contacts.find(contact => contact.id === action.payload.id)
  }
  switch (action.type) {
    case INIT_CONTACTS: return {
      ...state,
      contacts: action.payload.contacts
    }
    case SELECT_CONTACT: return {
      ...state,
      selectedContact: action.payload.contact
    }
    case INIT_MESSAGES: return {
      ...state,
      messages: action.payload.messages
    }
    case ADD_NEW_MESSAGE: return {
      ...state,
      messages: [action.payload.message, ...state.messages]
    }
    case LOAD_MORE_MESSAGES: return {
      ...state,
      messages: [...state.messages, ...action.payload.messages]
    }
    case UPDATE_BADGE_IN_DIRECT: return {
      ...state,
      counterMessages: state.counterMessages + 1,
      contacts: state.contacts.map((contact: ChatContact) => {
        if(contact.id === action.payload.id) {
          return {
            ...contact,
            unread: contact.unread + 1
          }
        }
        return contact;
      })
    }
    case ANULL_BADGE_IN_DIRECT:
    const contact = findContact();
    const getBadgeCount = contact ? contact.unread : 1;
    
    return {
      ...state,
      counterMessages: state.counterMessages - getBadgeCount,
      contacts: state.contacts.map((contact: ChatContact) => {
        if(contact.id === action.payload.id) {
          return {
            ...contact,
            unread: 0
          }
        }
        return contact;
      })
    }
    case MARK_MY_MESSAGES_AS_READ: return {
      ...state,
      messages: state.messages.map((message: Message) => {
        if (message.from === action.payload.userId) {
          return {
            ...message,
            read: true
          }
        }
        return message;
      })
    }
    case UPDATE_ONSLINE_SELECTED_CONTACT: 
    return {
      ...state,
      selectedContact: {
        ...state.selectedContact,
        isOnline: action.payload.online
      }
    }
    case UPDATE_ONSLINE_CONTACT_STATUS: 
    return {
      ...state,
      contacts: state.contacts.map(contact => {
        if(contact.user.id === action.payload.id) {
          return {
            ...contact,
            isOnline: action.payload.online
          }
        }
        return contact;
      })
    }
    case ADD_NEW_CHAT:
      return {
        ...state,
        contacts: [action.payload.contact, ...state.contacts]
    }
    case INIT_COUNTER: return {
      ...state,
      counterMessages: action.payload.unreadCount
    }
    default:
      return state;
  }
};

export default Messanger;
