import {
  LOG_OUT,
  SIGN_IN,
  UPDATE_TOKENS,
  DECRIMENT_FOLLOWERS,
  INCREMENT_FOLLOWERS,
  INCREMENT_FOLLOWINGS,
  DECRIMENT_FOLLOWINGS,
  ADD_USER,
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
