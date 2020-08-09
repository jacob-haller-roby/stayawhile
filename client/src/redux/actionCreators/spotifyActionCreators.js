import spotifyActions from "../actions/spotifyActions";
import api from '../../util/api';
import {currentRoomSelector, spotifyCurrentTrackSelector} from "../selectors/selectors";

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

export const registerBrowser = (browserId) => dispatch => {
    api.put(`/spotify/register/${browserId}`)
        .then(res => dispatch({
            type: spotifyActions.REGISTER_BROWSER,
            browserId: res
        }));
};

export const playPlaylist = (playlistId) => dispatch => {
    dispatch({
        type: spotifyActions.SPOTIFY_PLAYLIST_SELECTED
    });

    api.put(`/spotify/play/${playlistId}`)
        .then(res => {
            console.log('started playing');
        })
};

export const spotifyPlayerStateChange = (spotifyState) => (dispatch, getState) => {
    const previousTrack = spotifyCurrentTrackSelector(getState());
    if (spotifyState.track_window.current_track.id !== previousTrack.id) {
        dispatch({
            type: spotifyActions.SPOTIFY_PLAYER_STATE_CHANGE,
            currentTrack: spotifyState.track_window.current_track,
            currentPlaylistUri: spotifyState.context.uri
        });
        api.put('/spotify/currentTrack', {
            currentTrack: spotifyState.track_window.current_track,
            roomId: currentRoomSelector(getState()).id
        });
    }
}
