import { combineReducers } from "redux";
import userReducer from "./UserReducer";
import follows from "./Follows";

export default combineReducers({
  userReducer,
  follows,
});
