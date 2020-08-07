import mirror from "../../util/mirror";
const roomActions = {
    "GET_MY_ROOMS": null,
    "ATTEND_ROOM": null,
    "DEPART_ROOM": null,
    "CREATE_ROOM": null,
    "INVITATION_RECEIVED": null,
    "JOINED_ROOM": null,
    "WRONG_PASSWORD": null
};

export default mirror(roomActions);