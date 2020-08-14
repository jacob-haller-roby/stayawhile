import spotifyActions from "../actions/spotifyActions";
import api from '../../util/api';
import {currentRoomSelector, isOwnerSelector, spotifyCurrentTrackSelector} from "../selectors/selectors";
import playerManager from "../../util/spotifyPlayerManager";

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
        .then(res => {
            playerManager.getVolume()
                .then(volume => dispatch({
                    type: spotifyActions.REGISTER_BROWSER,
                    browserId: res,
                    volume: volume
                }))
        });
};

export const playPlaylist = (playlistId) => dispatch => {
    dispatch({
        type: spotifyActions.SPOTIFY_PLAYLIST_SELECTED
    });

    api.put(`/spotify/play/${playlistId}`);
};

export const spotifyPlayerStateChange = (spotifyState) => (dispatch, getState) => {
    const previousTrack = spotifyCurrentTrackSelector(getState());
    dispatch({
        type: spotifyActions.SPOTIFY_PLAYER_STATE_CHANGE,
        currentTrack: spotifyState.track_window.current_track,
        currentPlaylistUri: spotifyState.context.uri,
        isPlaying: !spotifyState.paused
    });
    if (spotifyState.track_window.current_track.id !== previousTrack.id) {
        if (isOwnerSelector(getState())) {
            api.put('/spotify/currentTrack', {
                currentTrack: spotifyState.track_window.current_track,
                roomId: currentRoomSelector(getState()).id
            });
        }
    }
};

export const spotifyNext = () => dispatch => {
    playerManager.next();
};
export const spotifyPrevious = () => dispatch => {
    playerManager.prev();
};
export const spotifyPauseOrPlay = () => dispatch => {
    playerManager.togglePlay();
};
export const spotifySetVolume = (level) => dispatch => {
    playerManager.setVolume(level)
        .then(playerManager.getVolume)
        .then(volume => dispatch({
            type: spotifyActions.SPOTIFY_SET_VOLUME,
            volume
        }));
};
