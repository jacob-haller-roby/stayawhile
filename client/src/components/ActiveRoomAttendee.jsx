import React from "react";
import {Paper} from "@material-ui/core";


class ActiveRoomAttendee extends React.Component {

    render() {
        return (
            <div>
                <Paper>{this.props.room.title}</Paper>
                Stay a while...
            </div>
        )
    }
};

export default ActiveRoomAttendee;