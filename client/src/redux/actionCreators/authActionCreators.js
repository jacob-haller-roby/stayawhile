import authActions from "../actions/authActions";
import api from '../../util/api';

export const refreshSpotifyAccessToken = () => dispatch => {
    api.get('/spotify/refresh')
        .then(res => dispatch({
            type: authActions.REFRESH_ACCESS_TOKEN,
            isLoggedIn: res.isLoggedIn,
            accessToken: res.accessToken
        }))
};

export const login = () => {
    api.get('/spotify/login')
        .then(res => window.location = res.loginRedirect);
    return {};
}

export const logout = () => dispatch => {
    api.get('/spotify/logout')
        .then(res => dispatch({
            type: authActions.LOGOUT,
            isLoggedIn: res.isLoggedIn
        }))
}

export const getProfile = () => dispatch => {
    api.get('/spotify/me')
        .then(res => dispatch({
            type: authActions.GET_PROFILE,
            profile: res
        }));
}