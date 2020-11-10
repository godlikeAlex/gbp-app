import { combineReducers } from "redux";
import userReducer from "./UserReducer";
import follows from "./Follows";
import messanger from './Messanger';

export default combineReducers({
  userReducer,
  follows,
  messanger
});
