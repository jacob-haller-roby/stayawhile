import spotifyActions from "../actions/spotifyActions";
import roomActions from "../actions/roomActions";

const spotifyReducer = (state = {myPlaylists: [], suggestedPlaylists: [], currentTrack: {}, isPlaying: false}, action) => {
    let newState = {...state};
    switch (action.type) {
        case spotifyActions.GET_PLAYLISTS:
            if(action.myPlaylists) {
                newState.myPlaylists = action.myPlaylists;
            }
            if(action.suggestedPlaylists) {
                newState.suggestedPlaylists = action.suggestedPlaylists;
            }
            break;
        case spotifyActions.SPOTIFY_PLAYER_STATE_CHANGE:
            newState.currentTrack = action.currentTrack;
            newState.currentPlaylistUri = action.currentPlaylistUri;
            newState.isPlaying = action.isPlaying;
            break;
        case spotifyActions.SPOTIFY_PLAYLIST_SELECTED:
            newState.currentPlaylistUri = null;
            break;
        case spotifyActions.REGISTER_BROWSER:
            newState.volume = action.volume;
            newState.browserId = action.browserId;
            break;
        case spotifyActions.SPOTIFY_SET_VOLUME:
            newState.volume = action.volume;
            break;
        default:
    }
    return newState;
}

export default spotifyReducer;