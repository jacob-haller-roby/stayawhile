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

export const processRoomInvite = () => dispatch => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; inviteRoomId=`);
    if (parts.length === 2) {
        const subParts = parts[1].split(';');
        let inviteRoomId = subParts.shift();
        dispatch({
            type: roomActions.INVITATION_RECEIVED,
            inviteRoomId
        });
    }
}

export const clearRoomInviteCookie = () => dispatch => {
    console.log('clearing old invite cookie');
    document.cookie = 'inviteRoomId="";expires='+(new Date()).toUTCString()+';path=/;';
}

export const acceptRoomInvite = (password) => dispatch => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; inviteRoomId=`);
    if (parts.length === 2) {
        const subParts = parts[1].split(';');
        let inviteRoomId = subParts.shift();

        api.post(`/room/membership/${inviteRoomId}`, {password})
            .catch((e) => {
                dispatch({
                    type: roomActions.WRONG_PASSWORD,
                    error: e.errorMessage
                });
                throw e;
            })
            .then(res => {
                dispatch({
                    type: roomActions.JOINED_ROOM,
                    rooms: res
                });
                dispatch(clearRoomInviteCookie());
            })
            .then(() => dispatch(attendRoom(inviteRoomId)))
            .catch((e) => {});
    }
}

export const saveRoomPlaylists = (room, playlists) => dispatch => {
    api.post(`/room/playlists/${room.id}`, {playlists})
        .then(res => dispatch({
            type: roomActions.SAVE_ROOM_PLAYLISTS,
            playlists: res
        }))
};

export const getRoomPlaylists = (room) => dispatch => {
    api.get(`/room/playlists/${room.id}`)
        .then(res => dispatch({
            type: roomActions.GET_ROOM_PLAYLISTS,
            playlists: res
        }));
};

export const saveRoomPlaylistPhrases = (roomId, playlistId, phraseArray) => dispatch => {
    api.put(`/room/playlists/${roomId}/phrases/${playlistId}`, {phrases: phraseArray})
        .then(res => dispatch({
            type: roomActions.SET_ROOM_PLAYLIST_PHRASES,
            playlistId,
            phrases: res
        }));
}