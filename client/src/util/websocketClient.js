import {receiveRoomAttendees} from "../redux/actionCreators/roomActionCreators";

const ws_host = process.env.REACT_APP_HOST.replace('https', 'wss');

const websocketClient = {};
websocketClient.init = (userId, dispatch, getState) => {
    if (websocketClient.socket) {
        return;
    }
    websocketClient.dispatch = dispatch;
    websocketClient.getState = getState;

    websocketClient.socket = new WebSocket(`${ws_host}/${userId}`);
    websocketClient.keepAlive();
    websocketClient.onclose = () => {
        setTimeout(websocketClient.init, 1000);
    };
    websocketClient.socket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        console.log(message);
        switch (message.type) {
            case 'ROOM_ATTENDEES':
                websocketClient.dispatch(receiveRoomAttendees(message.message.roomId, message.message.attendees));
                break;
            default:
        }

    });
}
websocketClient.keepAlive = () => {
    if (websocketClient.socket && websocketClient.socket.readyState === websocketClient.socket.OPEN) {
        websocketClient.socket.send('');
    }
    setTimeout(websocketClient.keepAlive, 1000 * 20);
};

websocketClient.send = (...args) => websocketClient.socket && websocketClient.socket.send(...args);


export default websocketClient;