import spotifyActions from "../actions/spotifyActions";

const spotifyReducer = (state = {myPlaylists: [], suggestedPlaylists: []}, action) => {
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
        default:
    }
    return newState;
}

export default spotifyReducer;