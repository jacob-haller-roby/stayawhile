import React from "react";
import {connect} from 'react-redux';
import {currentRoomSelector, roomsSelector} from "../redux/selectors/selectors";
import RoomList from "./RoomList";
import ActiveRoom from "./ActiveRoom";

class Router extends React.Component {
    render() {
        if (!this.props.currentRoom) {
            return <RoomList/>;
        } else {
            return <ActiveRoom room={this.props.currentRoom}/>;
        }
    }
};

export default connect(
    state => ({
        myRooms: roomsSelector(state),
        currentRoom: currentRoomSelector(state)
    }),
    dispatch => ({
    })
)(Router);