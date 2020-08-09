import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Typography
} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";

class PlaylistDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistDialogOpen: false,
            voiceActivationState: false,
            chosenPlaylists: this.initialPlaylists()
        }
        this.openPlaylistDialog = this.openPlaylistDialog.bind(this);
        this.closePlaylistDialog = this.closePlaylistDialog.bind(this);
        this.togglePlaylist = this.togglePlaylist.bind(this);
        this.saveRoomPlaylists = this.saveRoomPlaylists.bind(this);
        this.initialPlaylists = this.initialPlaylists.bind(this);
    }

    initialPlaylists() {
        return this.props.playlists.myPlaylists.filter(playlist => this.props.chosenPlaylists.some(p => p.id === playlist.id))
            .concat(this.props.playlists.suggestedPlaylists.filter(playlist => this.props.chosenPlaylists.some(p => p.id === playlist.id)))
    }

    openPlaylistDialog() {
        this.setState({playlistDialogOpen: true, chosenPlaylists: this.initialPlaylists()})
    }

    closePlaylistDialog() {
        this.setState({playlistDialogOpen: false, chosenPlaylists: []})
    }

    saveRoomPlaylists() {
        this.props.saveRoomPlaylists(this.state.chosenPlaylists);
        this.closePlaylistDialog();
    }

    togglePlaylist(playlist) {
        this.setState(prevState => {
            if (prevState.chosenPlaylists.some(p => p.id === playlist.id)){
                return {
                    chosenPlaylists: prevState.chosenPlaylists.filter(p => p.id !== playlist.id)
                }
            } else {
                return {
                    chosenPlaylists: [...prevState.chosenPlaylists, playlist]
                }
            }
        });

    }

    renderPlaylistDialog() {
        return (
            <Dialog open={this.state.playlistDialogOpen} onClose={this.closePlaylistDialog} maxWidth="lg">
                <DialogTitle id="playlist-dialog">Choose playlists to use in this room</DialogTitle>
                <DialogContent>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography variant="h5" component="h2">
                                My Playlists
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                {this.props.playlists.myPlaylists.map(playlist => {
                                    let isSelected = this.state.chosenPlaylists.some(p => p.id === playlist.id);
                                    return (
                                        <Grid item xs={12} sm={6} lg={3}>
                                            <Card raised={isSelected}
                                                  style={{backgroundColor: isSelected ? 'beige' : 'lightgray', userSelect: 'none'}}
                                                  onClick={this.togglePlaylist.bind(this, playlist)} >
                                                <CardMedia image={playlist.images.length && playlist.images[0].url}
                                                           style={{height: '100px'}}
                                                           title={playlist.name}/>
                                                <CardContent>
                                                    <Typography gutterBottom variant="caption" component="p" noWrap>
                                                        {playlist.name}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                    <Divider/>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMore/>}>
                            <Typography variant="h5" component="h2">
                                Suggested Playlists
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={3}>
                                {this.props.playlists.suggestedPlaylists.map(playlist => {
                                    let isSelected = this.state.chosenPlaylists.some(p => p.id === playlist.id);
                                    return (
                                        <Grid item xs={12} sm={6} lg={3}>
                                            <Card raised={isSelected}
                                                  style={{backgroundColor: isSelected ? 'beige' : 'lightgray', userSelect: 'none'}}
                                                  onClick={this.togglePlaylist.bind(this, playlist)} >
                                                <CardMedia image={playlist.images.length && playlist.images[0].url}
                                                           style={{height: '100px'}}
                                                           title={playlist.name}/>
                                                <CardContent>
                                                    <Typography gutterBottom variant="caption" component="p" noWrap>
                                                        {playlist.name}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.saveRoomPlaylists} color="primary">Save</Button>
                    <Button onClick={this.closePlaylistDialog} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Button variant="contained" onClick={this.openPlaylistDialog} color="primary">
                    Select Playlists
                </Button>
                {this.renderPlaylistDialog()}
            </React.Fragment>
        );
    }
};

export default PlaylistDialog;