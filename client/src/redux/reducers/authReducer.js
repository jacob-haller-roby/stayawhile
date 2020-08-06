import authActions from "../actions/authActions";

const authReducer = (state = {}, action) => {
    let newState = {...state};
    switch (action.type) {
        case authActions.LOGOUT:
        case authActions.REFRESH_ACCESS_TOKEN:
            newState.isLoggedIn = action.isLoggedIn;
            newState.verifiedLogin = true;
            break;
        case authActions.GET_PROFILE:
            newState.profile = action.profile;
        default:
    }
    return newState;
}

export default authReducer;