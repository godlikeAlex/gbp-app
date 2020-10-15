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
  TOGGLE_FOLLOW_GLOBAL,
  INIT_POSTS,
  LOAD_MORE_POSTS
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
  posts: {}, // userId: posts[]
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
      const allReadyExists = state.users.findIndex((u: any) => u.id === action.payload.id);

      let users: any[] = state.users;
      
      if (allReadyExists !== -1) {
        users = users.filter(user => user.id != action.payload.id);    
      } 

      users.push(action.payload);

      return {
        ...state,
        users
      };
    case TOGGLE_FOLLOW_GLOBAL: 
      return {
        ...state,
        users: state.users.map(
          (item: any) => {
            if (item.id === action.payload.toggleId) {
              return { ...item, canSubscribe: !item.canSubscribe };
            }

            return item;
          }
        )
      }
    case INIT_POSTS: return {
      ...state,
      posts: {
        ...state.posts,
        [action.payload.id]: {
          initialLoading: action.payload.initialLoading,
          data: action.payload.posts
        }
      }
    }
    case LOAD_MORE_POSTS: return {
      ...state,
      posts: {
        ...state.posts,
        [action.payload.id]: {
          ...state.posts[action.payload.id],
          data: [
            ...state.posts[action.payload.id].data,
            ...action.payload.posts
          ]
        }
      }
    }
    default:
      return state;
  }
};

export default user;
