import React from "react";
import {Card, CardContent, Grid, Paper, Typography} from "@material-ui/core";
import AttendeesList from "./AttendeesList";
import InviteLink from "./InviteLink";


class ActiveRoomAttendee extends React.Component {

    render() {
        return (


            <Grid container justify='center' spacing={3} style={{flexDirection: 'column', flex: 1}}>
                <Grid item xs={12} style={{flex: 'none'}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {this.props.room.title}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} style={{display: 'flex', justifyContent: 'center', flex: 'none'}}>
                    <AttendeesList attendees={this.props.roomAttendees}>
                        <InviteLink room={this.props.room}/>
                    </AttendeesList>
                </Grid>
                <Grid item xs={12} style={{flex: 1, justifyContent: 'center', display: 'flex'}}>
                    {
                        this.props.currentTrack.album &&
                        <Paper>
                            <img src={`${this.props.currentTrack.album.images[0].url}`} style={{objectFit: 'cover'}}/>
                        </Paper>
                    }
                </Grid>
            </Grid>
        );
    }
}

export default ActiveRoomAttendee;