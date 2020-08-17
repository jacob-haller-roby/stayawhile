import React from "react";
import {Card, CardContent, Grid, Paper, Typography} from "@material-ui/core";
import AttendeesList from "./AttendeesList";
import InviteLink from "./InviteLink";


class ActiveRoomAttendee extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Grid container justify='center' spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    {this.props.room.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} style={{display: 'flex', justifyContent: 'center'}}>
                        <AttendeesList attendees={this.props.roomAttendees}>
                            <InviteLink room={this.props.room}/>
                        </AttendeesList>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }
}

export default ActiveRoomAttendee;