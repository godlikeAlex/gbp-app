import {
  SIGN_IN,
  LOG_OUT,
  UPDATE_TOKENS,
  DECRIMENT_FOLLOWERS,
  INCREMENT_FOLLOWERS,
  INCREMENT_FOLLOWINGS,
  DECRIMENT_FOLLOWINGS,
  ADD_USER,
  INIT_PROFILE,
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
  myProfile: {
    name: "",
    description: "",
    user: {
      name: "",
    },
    countFollowings: 0,
    countFollowers: 0,
    profile_photo: undefined,
  },
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
    case INIT_PROFILE: {
      return {
        ...state,
        myProfile: action.payload,
      };
    }
    case INCREMENT_FOLLOWERS:
      return {
        ...state,
        myProfile: {
          ...state.myProfile,
          countFollowers: state.myProfile.countFollowers + 1,
        },
      };
    case DECRIMENT_FOLLOWERS:
      return {
        ...state,
        myProfile: {
          ...state.myProfile,
          countFollowers: state.myProfile.countFollowers - 1,
        },
      };
    case INCREMENT_FOLLOWINGS:
      return {
        ...state,
        myProfile: {
          ...state.myProfile,
          countFollowings: state.myProfile.countFollowings + 1,
        },
      };
    case DECRIMENT_FOLLOWINGS:
      return {
        ...state,
        myProfile: {
          ...state.myProfile,
          countFollowings: state.myProfile.countFollowings - 1,
        },
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
