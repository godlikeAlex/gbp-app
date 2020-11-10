export const SIGN_IN = "SIGN_IN";
export const LOG_OUT = "LOG_OUT";
export const UPDATE_TOKENS = "UPDATE_TOKENS";
export const INCREMENT_FOLLOWERS = "INCREMENT_FOLLOWS";
export const DECRIMENT_FOLLOWERS = "DECRIMENT_FOLLOWERS";
export const INCREMENT_FOLLOWINGS = "INCREMENT_FOLLOWINGS";
export const DECRIMENT_FOLLOWINGS = "DECRIMENT_FOLLOWINGS";
export const ADD_USER = "ADD_USER";

export const ADD_FOLLOWERS = "ADD_FOLLOWERS";
export const INIT_FOLLOWERS = "INIT_FOLLOWERS";
export const TOGGLE_FOLLOW = "TOGGLE_FOLLOW";
export const INIT_FOLLOWINGS = "INIT_FOLLOWINGS";
export const TOGGLE_FOLLOWING = "TOGGLE_FOLLOWING";
export const INIT_PROFILE = "INIT_PROFILE";
export const TOGGLE_FOLLOW_GLOBAL = 'TOGGLE_FOLLOW_GLOBAL';

export const INIT_POSTS = 'INIT_POSTS';
export const LOAD_MORE_POSTS = 'LOAD_MORE_POSTS';

export const UPDATE_PROFILE = 'UPDATE_PROFILE';

export const REMOVE_POST = 'REMOVE_POST';


// Mesanger 
export const INIT_CONTACTS = 'INIT_CONTACTS';
export const SELECT_CONTACT = 'SELECT_CONTACT';
export const INIT_MESSAGES = 'INIT_MESSAGES';
export const ADD_NEW_MESSAGE = 'ADD_NEW_MESSAGE';
export const UPDATE_BADGE_IN_DIRECT = 'UPDATE_BADGE_IN_DIRECT';
export const ANULL_BADGE_IN_DIRECT = 'ANULL_BADGE_IN_DIRECT';
export const MARK_MY_MESSAGES_AS_READ = 'MARK_MY_MESSAGES_AS_READ';
export const UPDATE_ONSLINE_SELECTED_CONTACT = 'UPDATE_ONSLINE_SELECTED_CONTACT';
export const UPDATE_ONSLINE_CONTACT_STATUS = 'UPDATE_ONSLINE_CONTACT_STATUS';
export const ADD_NEW_CHAT = 'ADD_NEW_CHAT';
export const INIT_COUNTER = 'INIT_COUNTER';
export const LOAD_MORE_MESSAGES = 'LOAD_MORE_MESSAGES';

export interface ChatContact {
  id: number;
  isOnline: boolean;
  user: {
    account_name: string,
    id: number,
    name: string,
    profile_photo?: string,
  };
  userOne: number;
  userTwo: number;
  unread: number;
}

export interface Message {
  chatId: number;
  createdAt: number;
  from: number;
  id: number;
  read: boolean | null;
  text: string;
  to: number;
  updatedAt: string;
}

export interface MessangerState {
  selectedContact: ChatContact | null;
  counterMessages: number;
  contacts: ChatContact[];
  messages: Message[];
}