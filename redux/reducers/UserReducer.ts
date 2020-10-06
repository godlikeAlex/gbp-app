import {
  SIGN_IN,
  LOG_OUT,
  UPDATE_TOKENS,
  DECRIMENT_FOLLOWERS,
  INCREMENT_FOLLOWERS,
  INCREMENT_FOLLOWINGS,
  DECRIMENT_FOLLOWINGS,
  ADD_USER,
} from "./../types";

const initialState = {
  auth: {
    refreshToken: null,
    token: null,
    user: {
      name: "a",
      account_name: "c",
    },
  },
  followers: 0,
  followings: 0,
  description: "",
  profile_photo: null,
  users: [],
};

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        auth: action.payload,
      };
    case LOG_OUT:
      return initialState;
    case UPDATE_TOKENS:
      return {
        ...state,
        auth: action.payload,
      };
    case INCREMENT_FOLLOWERS:
      return {
        ...state,
        followers: state["followers"] + 1,
      };
    case DECRIMENT_FOLLOWERS:
      return {
        ...state,
        followers: state["followers"] - 1,
      };
    case INCREMENT_FOLLOWINGS:
      return {
        ...state,
        followers: state["followings"] + 1,
      };
    case DECRIMENT_FOLLOWINGS:
      return {
        ...state,
        followers: state["followings"] - 1,
      };
    case ADD_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    default:
      return state;
  }
};

export default user;
