import roomActions from "../actions/roomActions";

const roomReducer = (state = {}, action) => {
    let newState = {...state};
    switch (action.type) {
        case roomActions.GET_MY_ROOMS:
        case roomActions.ATTEND_ROOM:
        case roomActions.DEPART_ROOM:
            newState.rooms = action.rooms;
            break;
        case roomActions.CREATE_ROOM:
            newState.rooms = [...newState.rooms, action.room];
            break;
        default:
    }
    return newState;
}

export default roomReducer;