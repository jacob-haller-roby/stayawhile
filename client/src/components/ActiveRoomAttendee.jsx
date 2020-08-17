import React from "react";
import {Paper} from "@material-ui/core";
import AttendeesList from "./AttendeesList";
import InviteLink from "./InviteLink";


class ActiveRoomAttendee extends React.Component {

    render() {
        return (
            <div>
                <Paper>{this.props.room.title}</Paper>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <AttendeesList attendees={this.props.roomAttendees}>
                        <InviteLink room={this.props.room}/>
                    </AttendeesList>
                </div>
            </div>
        )
    }
}

export default ActiveRoomAttendee;