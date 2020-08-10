import React from 'react';
import {Card, CardActions} from "@material-ui/core";
import VoiceListener from "./VoiceListener";
import PlaylistDialog from "./PlaylistDialog";
import SpeechLogDialog from "./SpeechLogDialog";

class RoomActions extends React.Component {
    constructor(props) {
        super(props);
        this.getVoiceCommands = this.getVoiceCommands.bind(this);
    }

    getVoiceCommands() {
        const playlists = this.props.roomPlaylists || [];
        const phraseList = {};
        const commands = playlists
            .map(playlist => {
                const phrases = playlist.phrases || [];
                return phrases
                    .filter(phrase => {
                        if (phraseList[phrase]) return false;
                        phraseList[phrase] = true;
                        return true;
                    })
                    .map(phrase => ({
                            command: '(*) ' + phrase + ' (*)',
                            callback: () => this.props.playPlaylist(playlist.id)
                        })
                    )
            })
            .flat()
            .concat({
                command: '*',
                callback: (speech) => speech && this.props.receiveSpeech(speech)
            });
        return commands;
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardActions>
                        <PlaylistDialog playlists={this.props.playlists}
                                        saveRoomPlaylists={this.props.saveRoomPlaylists}
                                        chosenPlaylists={this.props.roomPlaylists}/>
                        <div style={{marginLeft: 'auto'}}/>
                        <SpeechLogDialog speechLog={this.props.speechLog}/>
                        <VoiceListener commands={this.getVoiceCommands()}/>
                    </CardActions>
                </Card>

            </React.Fragment>
        );
    }
}

export default RoomActions;