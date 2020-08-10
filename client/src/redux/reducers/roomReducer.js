import roomActions from "../actions/roomActions";

const roomReducer = (state = {rooms: [], roomPlaylists: [], speech: []}, action) => {
    let newState = {...state};
    switch (action.type) {
        case roomActions.GET_MY_ROOMS:
        case roomActions.ATTEND_ROOM:
        case roomActions.DEPART_ROOM:
            newState.roomPlaylists = [];
            newState.rooms = action.rooms;
            newState.speech = [];
            break;
        case roomActions.JOINED_ROOM:
            newState.rooms = action.rooms;
            newState.inviteRoomId = null;
            newState.invitePasswordError = false;
            break;
        case roomActions.WRONG_PASSWORD:
            newState.invitePasswordError = action.error;
            break;
        case roomActions.CREATE_ROOM:
            newState.rooms = [...newState.rooms, action.room];
            break;
        case roomActions.INVITATION_RECEIVED:
            newState.inviteRoomId = action.inviteRoomId;
            break;
        case roomActions.GET_ROOM_PLAYLISTS:
        case roomActions.SAVE_ROOM_PLAYLISTS:
            newState.roomPlaylists = action.playlists;
            break;
        case roomActions.SET_ROOM_PLAYLIST_PHRASES:
            newState.roomPlaylists = newState.roomPlaylists.map(playlist => {
                if (playlist.id === action.playlistId) {
                    return {
                        ...playlist,
                        phrases: action.phrases
                    }
                }
                return playlist;
            });
            break;
        case roomActions.RECEIVE_SPEECH:
            newState.speech = [...newState.speech, action.speech]
        default:
    }
    return newState;
}

export default roomReducer;