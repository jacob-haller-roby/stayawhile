import mirror from "../../util/mirror";
const spotifyActions = {
    "GET_PLAYLISTS": null,
    "REGISTER_BROWSER": null,
    "SPOTIFY_PLAYER_STATE_CHANGE": null,
    "SPOTIFY_PLAYLIST_SELECTED": null,
    "SPOTIFY_SET_VOLUME": null
};

export default mirror(spotifyActions);