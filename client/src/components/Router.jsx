import React from "react";
import {connect} from 'react-redux';
import {
    currentRoomSelector,
    playlistSelector,
    profileNameSelector,
    roomPlaylistsSelector,
    roomsSelector
} from "../redux/selectors/selectors";
import Homepage from "./Homepage";
import ActiveRoomAttendee from "./ActiveRoomAttendee";
import {getPlaylists} from "../redux/actionCreators/spotifyActionCreators";
import ActiveRoomOwner from "./ActiveRoomOwner";
import {saveRoomPlaylists, getRoomPlaylists} from "../redux/actionCreators/roomActionCreators";

class Router extends React.Component {
    render() {
        if (!this.props.currentRoom) {
            return <Homepage/>;
        } else if (this.props.profileName === this.props.currentRoom.owner) {
            return <ActiveRoomOwner room={this.props.currentRoom}
                                    getPlaylists={this.props.getPlaylists}
                                    playlists={this.props.playlists}
                                    profileName={this.props.profileName}
                                    saveRoomPlaylists={this.props.saveRoomPlaylists}
                                    roomPlaylists={this.props.roomPlaylists}
                                    getRoomPlaylists={this.props.getRoomPlaylists}
            />;
        } else {
            return <ActiveRoomAttendee room={this.props.currentRoom}/>;
        }
    }
};

export default connect(
    state => ({
        myRooms: roomsSelector(state),
        currentRoom: currentRoomSelector(state),
        playlists: playlistSelector(state),
        profileName: profileNameSelector(state),
        roomPlaylists: roomPlaylistsSelector(state)
    }),
    dispatch => ({
        getPlaylists: () => dispatch(getPlaylists()),
        saveRoomPlaylists: (room, playlists) => dispatch(saveRoomPlaylists(room, playlists)),
        getRoomPlaylists: (room) => dispatch(getRoomPlaylists(room))
    }),
    (stateProps, dispatchProps) => ({
        ...stateProps,
        ...dispatchProps,
        saveRoomPlaylists: (playlists) => dispatchProps.saveRoomPlaylists(stateProps.currentRoom, playlists),
        getRoomPlaylists: () => dispatchProps.getRoomPlaylists(stateProps.currentRoom)
    })
)(Router);