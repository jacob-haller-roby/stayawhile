import React from "react";
import {Card, CardContent, CardMedia, CardActions, Grid, Typography, IconButton} from "@material-ui/core";
import RoomActions from "./RoomActions";
import PlaylistPhraseDialog from "./PlaylistPhraseDialog";
import {Chat, PlayArrow} from "@material-ui/icons";
import {saveRoomPlaylistPhrases} from "../redux/actionCreators/roomActionCreators";


class ActiveRoomOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistPhraseDialogOpen: false,
            editPlaylist: {}
        }
        this.playlistPhraseDialogClose = this.playlistPhraseDialogClose.bind(this);
        this.playlistPhraseDialogOpen = this.playlistPhraseDialogOpen.bind(this);
    }
    componentDidMount() {
        this.props.getPlaylists();
        this.props.getRoomPlaylists();
    }

    playlistPhraseDialogOpen(editPlaylist) {
        this.setState({playlistPhraseDialogOpen: true, editPlaylist});
    }

    playlistPhraseDialogClose() {
        this.setState({playlistPhraseDialogOpen: false, editPlaylist: {}});
    }

    render() {
        return (
            <React.Fragment>
                <PlaylistPhraseDialog open={this.state.playlistPhraseDialogOpen}
                                      onClose={this.playlistPhraseDialogClose}
                                      playlist={this.state.editPlaylist}
                                      saveRoomPlaylistPhrases={(phrases) => this.props.saveRoomPlaylistPhrases(this.props.room.id, this.state.editPlaylist.id, phrases)}/>
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
                    <Grid item md={6} xs={12}>
                        <RoomActions playlists={this.props.playlists}
                                     room={this.props.room}
                                     saveRoomPlaylists={this.props.saveRoomPlaylists}
                                     roomPlaylists={this.props.roomPlaylists}
                                     playPlaylist={this.props.playPlaylist}
                                     receiveSpeech={this.props.receiveSpeech}
                                     speechLog={this.props.speechLog}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {this.props.roomPlaylists.map(playlist => {
                        const isPlaying = playlist.uri === this.props.currentPlaylistUri;
                        return (
                            <Grid item xs={12} sm={6} lg={3}>
                                <Card raised={isPlaying}
                                      style={{
                                          backgroundColor: isPlaying ? 'beige' : 'lightgray',
                                          userSelect: 'none',
                                      }}>
                                    <CardMedia onClick={this.props.playPlaylist.bind(this, playlist.id)}
                                               image={playlist.imageUrl}
                                               style={{
                                                   height: '100px',
                                                   cursor: 'pointer',
                                                   pointerEvents: isPlaying ? 'none' : 'auto'
                                               }}
                                               title={playlist.name}/>
                                    <CardContent>
                                        <Typography gutterBottom variant="caption" component="p" noWrap>
                                            {playlist.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton onClick={this.playlistPhraseDialogOpen.bind(this, playlist)} edge="end">
                                            <Chat/>
                                        </IconButton>
                                        <div style={{flexGrow:1}}/>
                                        <IconButton onClick={this.props.playPlaylist.bind(this, playlist.id)} disabled={isPlaying}>
                                            <PlayArrow style={{color: isPlaying ? 'yellowgreen' : 'rgba(0, 0, 0, 0.54)'}}/>
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </React.Fragment>

        )
    }
};

export default ActiveRoomOwner;