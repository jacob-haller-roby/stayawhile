import api from '../../util/api';
import roomActions from "../actions/roomActions";

export const createRoom = (options) => dispatch => {
    api.post('/room/create', options)
        .then(res => {
            dispatch({
                type: roomActions.CREATE_ROOM,
                room: res
            });
            dispatch(attendRoom(res.id));
        })

}

export const getMyRooms = () => dispatch => {
    api.get('/room/membership')
        .then(res => dispatch({
            type: roomActions.GET_MY_ROOMS,
            rooms: res
        }));
};

export const attendRoom = (roomId) => dispatch => {
    api.post(`/room/attend/${roomId}`)
        .then(res => dispatch({
            type: roomActions.ATTEND_ROOM,
            rooms: res
        }));
};

export const departRoom = () => dispatch => {
    api.delete(`/room/attend`)
        .then(res => dispatch({
            type: roomActions.DEPART_ROOM,
            rooms: res
        }));
};