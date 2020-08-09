import spotifyActions from "../actions/spotifyActions";
import api from '../../util/api';

export const getPlaylists = () => dispatch => {
    api.get('/spotify/playlists')
        .then(res => dispatch({
            type: spotifyActions.GET_PLAYLISTS,
            myPlaylists: res
        }));
    api.get('/spotify/playlists/suggested')
        .then(res => dispatch({
            type: spotifyActions.GET_PLAYLISTS,
            suggestedPlaylists: res
        }))
};
