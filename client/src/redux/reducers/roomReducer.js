import roomActions from "../actions/roomActions";

const roomReducer = (state = {rooms: []}, action) => {
    let newState = {...state};
    switch (action.type) {
        case roomActions.GET_MY_ROOMS:
        case roomActions.ATTEND_ROOM:
        case roomActions.DEPART_ROOM:
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
        default:
    }
    return newState;
}

export default roomReducer;