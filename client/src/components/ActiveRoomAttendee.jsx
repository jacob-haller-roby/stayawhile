import React from "react";
import {Paper} from "@material-ui/core";
import AttendeesList from "./AttendeesList";


class ActiveRoomAttendee extends React.Component {

    render() {
        return (
            <div>
                <Paper>{this.props.room.title}</Paper>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <AttendeesList attendees={this.props.roomAttendees}/>
                </div>
            </div>
        )
    }
}

export default ActiveRoomAttendee;