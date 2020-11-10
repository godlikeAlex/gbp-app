import {
  LOG_OUT,
  SIGN_IN,
  UPDATE_TOKENS,
  DECRIMENT_FOLLOWERS,
  INCREMENT_FOLLOWERS,
  INCREMENT_FOLLOWINGS,
  DECRIMENT_FOLLOWINGS,
  ADD_USER,
  ADD_FOLLOWERS,
  INIT_FOLLOWERS,
  TOGGLE_FOLLOW,
  INIT_FOLLOWINGS,
  TOGGLE_FOLLOWING,
  INIT_PROFILE,
  TOGGLE_FOLLOW_GLOBAL,
  INIT_POSTS,
  LOAD_MORE_POSTS,
  UPDATE_PROFILE,
  REMOVE_POST,
  INIT_CONTACTS,
  SELECT_CONTACT,
  Message,
  INIT_MESSAGES,
  ADD_NEW_MESSAGE,
  UPDATE_BADGE_IN_DIRECT,
  ANULL_BADGE_IN_DIRECT,
  MARK_MY_MESSAGES_AS_READ,
  UPDATE_ONSLINE_SELECTED_CONTACT,
  UPDATE_ONSLINE_CONTACT_STATUS,
  ChatContact,
  ADD_NEW_CHAT,
  INIT_COUNTER,
  LOAD_MORE_MESSAGES
} from "./types";

export const login = (payload: any) => {
  return {
    type: SIGN_IN,
    payload,
  };
};

export const logOut = () => {
  return {
    type: LOG_OUT,
  };
};

export const updateTokens = (payload: any) => {
  return {
    type: UPDATE_TOKENS,
    payload,
  };
};

export const incFollows = (follower: boolean) => {
  return {
    type: follower ? INCREMENT_FOLLOWERS : INCREMENT_FOLLOWINGS,
  };
};

export const decFollows = (follower: boolean) => {
  return {
    type: follower ? DECRIMENT_FOLLOWERS : DECRIMENT_FOLLOWINGS,
  };
};

export const addUser = (payload: any) => {
  return {
    type: ADD_USER,
    payload,
  };
};

export const initFollowers = (payload: { id: number; followers: any[] }) => {
  return {
    type: INIT_FOLLOWERS,
    payload,
  };
};

export const initFollowings = (payload: { id: number; followings: any[] }) => {
  return {
    type: INIT_FOLLOWINGS,
    payload,
  };
};

export const addFollowers = (payload: { id: number; followers: any[] }) => {
  return {
    type: ADD_FOLLOWERS,
    payload,
  };
};

export const toggleFollow = (payload: { id: number; toggleId: number }) => {
  return {
    type: TOGGLE_FOLLOW,
    payload,
  };
};

export const toggleFollowing = (payload: { id: number; toggleId: number }) => {
  return {
    type: TOGGLE_FOLLOWING,
    payload,
  };
};

export const initProfile = (payload) => {
  return {
    type: INIT_PROFILE,
    payload,
  };
};

export const toggleFollowToUser = (payload: any) => {
  return {
    type: TOGGLE_FOLLOW_GLOBAL,
    payload
  }
}

export const initPosts = (payload: {id: number, posts: any[]}) => {
  return {
    type: INIT_POSTS,
    payload
  }
}

export const loadMorePosts = (payload: {id: number, posts: any[]}) => {
  return {
    type: LOAD_MORE_POSTS,
    payload
  }
}

export const updateProfile = (payload: {name?: string, account_name?: string, avatar?: any, description?: string}) => {
  return {
    type: UPDATE_PROFILE,
    payload
  }
}

export const removePost = (payload: {userId: string | number, postId: string | number}) => {
  return {
    type: REMOVE_POST,
    payload
  }
}

export const initContacts = (payload: {contacts: any[]}) => {
  return {
    type: INIT_CONTACTS,
    payload
  }
}

export const selectContact = (payload: {contact: any}) => {
  return {
    type: SELECT_CONTACT,
    payload
  }
}

export const initMessages = (payload: {messages: Message[]}) => {
  return {
    type: INIT_MESSAGES,
    payload
  }
}

export const addNewMessage = (payload: {message: Message}) => {
  return {
    type: ADD_NEW_MESSAGE,
    payload
  }
}

export const updateBadgeInDirect = (payload: {id: number}) => {
  return {
    type: UPDATE_BADGE_IN_DIRECT,
    payload
  }
}

export const aNullBadgeInDirect = (payload: {id: number}) => {
  return {
    type: ANULL_BADGE_IN_DIRECT,
    payload
  }
}

export const markMessagesAsRead = (payload: {userId: number, chatId: number}) => {
  return {
    type: MARK_MY_MESSAGES_AS_READ,
    payload
  }
}

export const updateOnlineSelectedContact = (payload: {online: boolean}) => {
  return {
    type: UPDATE_ONSLINE_SELECTED_CONTACT,
    payload
  }
}

export const updateOnlineStatusInContacts = (payload: {id: string, online: boolean}) => {
  return {
    type: UPDATE_ONSLINE_CONTACT_STATUS,
    payload
  }
}

export const addNewChat = (payload: {contact: ChatContact}) => {
  return {
    type: ADD_NEW_CHAT,
    payload
  }
}

export const initCounter = (payload: {unreadCount: number}) => {
  return {
    type: INIT_COUNTER,
    payload
  }
}

export const loadMoreMessages = (payload: {messages: Message[]}) => {
  return {
    type: LOAD_MORE_MESSAGES,
    payload
  }
}

