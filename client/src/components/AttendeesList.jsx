import React from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Paper} from "@material-ui/core";

class AttendeesList extends React.Component {
    render() {
        return (
            <Paper style={{flexShrink: 1, display: 'flex'}}>
                <List
                    subheader={
                        <ListSubheader component="div" id="attendees-list-header">
                            Current Room Attendees
                        </ListSubheader>
                    }
                >
                    {this.props.attendees.map(attendee => (
                        <ListItem key={attendee.id}>
                            <ListItemAvatar>
                                <Avatar src={attendee.imageUrl}/>
                            </ListItemAvatar>
                            <ListItemText primary={attendee.display_name}/>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        )
    }
};

export default AttendeesList;