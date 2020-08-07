import React from "react";
import {connect} from 'react-redux';
import {attendRoom, departRoom, getMyRooms} from "../redux/actionCreators/roomActionCreators";
import {currentRoomSelector, roomsSelector} from "../redux/selectors/selectors";
import RoomList from "./RoomList";
import ActiveRoom from "./ActiveRoom";

class Router extends React.Component {
    componentDidMount() {
        this.props.getMyRooms()
    }

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
        attendRoom: (roomId) => dispatch(attendRoom(roomId)),
        departRoom: () => dispatch(departRoom()),
        getMyRooms: () => dispatch(getMyRooms())
    })
)(Router);