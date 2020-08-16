import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography
} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";

class AttendeesList extends React.Component {
    render() {
        return (
            <Paper style={{flexShrink: 1, display: 'flex'}}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore/>}>
                        <Typography>
                            Current Room Attendees
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {this.props.attendees.map(attendee => (
                                <ListItem key={attendee.id}>
                                    <ListItemAvatar>
                                        <Avatar src={attendee.imageUrl}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={attendee.display_name}/>
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </Paper>
        )
    }
};

export default AttendeesList;