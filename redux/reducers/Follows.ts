import {
  ADD_FOLLOWERS,
  INIT_FOLLOWERS,
  INIT_FOLLOWINGS,
  TOGGLE_FOLLOW,
  TOGGLE_FOLLOWING,
} from "./../types";

const initialState = {
  followers: {},
  followings: {},
};

const follows = (state: any = initialState, action: any) => {
  const toggleFollows = (action: any) => {
    let finalState = { ...state };

    if (state.followers.hasOwnProperty(action.payload.id)) {
      finalState.followers = {
        ...state.followers,
        [action.payload.id]: state["followers"][action.payload.id].map(
          (item) => {
            if (item.id === action.payload.toggleId) {
              return { ...item, subscribed: !item.subscribed };
            }

            return item;
          }
        ),
      };
    }

    if (state.followings.hasOwnProperty(action.payload.id)) {
      finalState.followings = {
        ...state.followings,
        [action.payload.id]: state["followings"][action.payload.id].map(
          (item) => {
            if (item.id === action.payload.toggleId) {
              return { ...item, subscribed: !item.subscribed };
            }

            return item;
          }
        ),
      };
    }

    return finalState;
  };

  switch (action.type) {
    case INIT_FOLLOWERS:
      return {
        ...state,
        followers: {
          ...state.followers,
          [action.payload.id]: action.payload.followers,
        },
      };
    case INIT_FOLLOWINGS:
      return {
        ...state,
        followings: {
          ...state.followings,
          [action.payload.id]: action.payload.followings,
        },
      };
    case ADD_FOLLOWERS:
      return {
        ...state,
        followers: {
          ...state.followers,
          [action.payload.id]: [
            ...state.followers[action.payload.id],
            ...action.payload.followers,
          ],
        },
      };
    case TOGGLE_FOLLOW:
      return toggleFollows(action);
    case TOGGLE_FOLLOWING:
      return toggleFollows(action);
    default:
      return state;
  }
};

export default follows;
