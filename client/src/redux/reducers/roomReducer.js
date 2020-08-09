import roomActions from "../actions/roomActions";

const roomReducer = (state = {rooms: [], roomPlaylists: []}, action) => {
    let newState = {...state};
    switch (action.type) {
        case roomActions.GET_MY_ROOMS:
        case roomActions.ATTEND_ROOM:
        case roomActions.DEPART_ROOM:
            newState.roomPlaylists = [];
            newState.rooms = action.rooms;
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
        default:
    }
    return newState;
}

export default roomReducer;