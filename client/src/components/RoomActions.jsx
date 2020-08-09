import React from 'react';
import {Button, Card, CardActions} from "@material-ui/core";
import VoiceListener from "./VoiceListener";
import PlaylistDialog from "./PlaylistDialog";

class RoomActions extends React.Component {
    //TODO: put into redux
    getVoiceCommands() {
        return [
            {
                command: 'roll initiative',
                callback: () => alert('PREPARE FOR BATTLE')
            },
            {
                command: 'roll for initiative',
                callback: () => alert('PREPARE FOR BATTLE')
            },
            {
                command: this.props.room.title,
                callback: () => alert('thats the room name!')
            }
        ];
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardActions>
                        <PlaylistDialog playlists={this.props.playlists} saveRoomPlaylists={this.props.saveRoomPlaylists} chosenPlaylists={this.props.roomPlaylists}/>
                        <div style={{marginLeft: 'auto'}}/>
                        <VoiceListener commands={this.getVoiceCommands()}/>
                    </CardActions>
                </Card>

            </React.Fragment>
        );
    }
}

export default RoomActions;