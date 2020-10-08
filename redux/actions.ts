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
