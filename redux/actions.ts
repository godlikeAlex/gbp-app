import { SIGN_IN } from "./types";

export const login = (payload: any) => {
  console.log(SIGN_IN);
  return {
    type: SIGN_IN,
    payload,
  };
};
