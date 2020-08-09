import React from 'react';
import {Card, CardActions} from "@material-ui/core";
import VoiceListener from "./VoiceListener";
import PlaylistDialog from "./PlaylistDialog";

class RoomActions extends React.Component {
    constructor(props) {
        super(props);
        this.getVoiceCommands = this.getVoiceCommands.bind(this);
    }
    getVoiceCommands() {
        const playlists = this.props.roomPlaylists || [];
        return playlists.map(playlist => {
            const phrases = playlist.phrases || [];
            return phrases.map(phrase => ({
                command: phrase,
                callback: () => this.props.playPlaylist(playlist.id)
            }));
        }).flat();
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