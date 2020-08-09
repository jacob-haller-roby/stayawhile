import authActions from "../actions/authActions";
import initialize from "../../util/spotifyPlayerInitializer";

const authReducer = (state = {}, action) => {
    let newState = {...state};
    switch (action.type) {
        case authActions.LOGOUT:
        case authActions.REFRESH_ACCESS_TOKEN:
            newState.isLoggedIn = action.isLoggedIn;
            newState.verifiedLogin = true;
            newState.accessToken = action.accessToken;
            if (newState.isLoggedIn) {
                initialize(action.accessToken, action.asyncDispatch);
            }
            break;
        case authActions.GET_PROFILE:
            newState.profile = action.profile;
            break;
        default:
    }
    return newState;
}

export default authReducer;