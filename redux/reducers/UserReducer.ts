import { SIGN_IN, LOG_OUT, UPDATE_TOKENS } from "./../types";

const initialState = {
  auth: {
    refreshToken: null,
    token: null,
    user: {
      name: "a",
      account_name: "c",
    },
  },
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
    default:
      return state;
  }
};

export default user;
