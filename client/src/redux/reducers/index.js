import {combineReducers} from "redux";
import authReducer from "./authReducer";
import roomReducer from "./roomReducer";
import spotifyReducer from "./spotifyReducer";

const rootReducer = combineReducers({
   auth: authReducer,
   room: roomReducer,
   spotify: spotifyReducer
});

export default rootReducer;