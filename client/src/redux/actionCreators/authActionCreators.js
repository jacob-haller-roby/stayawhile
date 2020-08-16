import authActions from "../actions/authActions";
import api from '../../util/api';
import playerManager from "../../util/spotifyPlayerManager";
import websocketClient from "../../util/websocketClient";

export const refreshSpotifyAccessToken = () => (dispatch, getState) => {
    api.get('/spotify/refresh')
        .then(res => {
            if (res.isLoggedIn) {
                playerManager.initialize();
                websocketClient.init(res.profile.id, dispatch, getState);
            }
            return dispatch({
                type: authActions.REFRESH_ACCESS_TOKEN,
                isLoggedIn: res.isLoggedIn,
                accessToken: res.accessToken
            })
        })
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