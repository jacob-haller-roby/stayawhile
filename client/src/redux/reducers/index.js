import {combineReducers} from "redux";
import authReducer from "./authReducer";
import roomReducer from "./roomReducer";

const rootReducer = combineReducers({
   auth: authReducer,
   room: roomReducer
});

export default rootReducer;