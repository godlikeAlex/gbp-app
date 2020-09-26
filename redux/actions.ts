import { SIGN_IN, UPDATE_TOKENS } from "./types";

export const login = (payload: any) => {
  return {
    type: SIGN_IN,
    payload,
  };
};

export const updateTokens = (payload: any) => {
  return {
    type: UPDATE_TOKENS,
    payload,
  };
};
