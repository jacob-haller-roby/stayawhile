import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Grid,
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
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore/>}>
                                <Typography>
                                    Room Attendees
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    <ListItem>
                                        <Grid container justify='center' spacing={3}>
                                            <Grid item>
                                                {this.props.children}
                                            </Grid>
                                        </Grid>
                                    </ListItem>
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
                    </Grid>
                </Grid>
            </Paper>
        )
    }
};

export default AttendeesList;