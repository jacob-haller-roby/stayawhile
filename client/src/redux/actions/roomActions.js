import mirror from "../../util/mirror";
const roomActions = {
    "GET_MY_ROOMS": null,
    "ATTEND_ROOM": null,
    "DEPART_ROOM": null,
    "CREATE_ROOM": null,
    "INVITATION_RECEIVED": null,
    "JOINED_ROOM": null,
    "WRONG_PASSWORD": null,
    "SAVE_ROOM_PLAYLISTS": null,
    "GET_ROOM_PLAYLISTS": null,
    "SET_ROOM_PLAYLIST_PHRASES": null,
    "RECEIVE_SPEECH": null,
    "RECEIVE_ROOM_ATTENDEES": null
};

export default mirror(roomActions);