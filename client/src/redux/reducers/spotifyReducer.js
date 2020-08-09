import spotifyActions from "../actions/spotifyActions";

const spotifyReducer = (state = {myPlaylists: [], suggestedPlaylists: [], currentTrack: {}}, action) => {
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
            newState.currentPlaylistUri = action.currentPlaylistUri
            break;
        case spotifyActions.SPOTIFY_PLAYLIST_SELECTED:
            newState.currentPlaylistUri = null;
            break;
        default:
    }
    return newState;
}

export default spotifyReducer;