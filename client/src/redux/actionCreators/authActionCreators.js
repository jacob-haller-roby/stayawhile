import authActions from "../actions/authActions";
import api from '../../util/api';

export const refreshSpotifyAccessToken = () => dispatch => {
    api.get('/spotify/refresh')
        .then(res => {
            dispatch({
                type: authActions.REFRESH_ACCESS_TOKEN,
                isLoggedIn: res.isLoggedIn
            });
        })
};

export const login = () => {
    api.get('/spotify/login')
        .then(res => window.location = res.loginRedirect);
    return {};
}

export const logout = () => dispatch => {
    api.get('/spotify/logout')
        .then(res => {
            dispatch({
                type: authActions.LOGOUT,
                isLoggedIn: false
            })
        })
}