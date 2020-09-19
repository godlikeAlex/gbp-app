import { SIGN_IN } from "./../types";

const initialState = {
  auth: {
    refreshToken: null,
    token: null,
    user: null,
  },
};

const user = (state = initialState, action: any) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        auth: action.payload,
      };
    default:
      return state;
  }
};

export default user;
