import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField
} from "@material-ui/core";
import {AddCircleOutline, Delete} from '@material-ui/icons'

class PlaylistPhraseDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phrases: this.props.playlist.phrases || [],
            open: false,
            newPhrase: '',
        };
        this.onClose = this.onClose.bind(this);
        this.removePhrase = this.removePhrase.bind(this);
        this.setNewPhrase = this.setNewPhrase.bind(this);
        this.addPhrase = this.addPhrase.bind(this);
        this.savePhrases = this.savePhrases.bind(this);
        this.hasChanges = this.hasChanges.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.open && this.props.open) {
            this.setState({phrases: this.props.playlist.phrases, open: this.props.open});
        }
    }

    onClose() {
        this.setState({open: false});
        this.props.onClose();
    }

    removePhrase(toDelete) {
        this.setState(state => ({
                phrases: state.phrases.filter(phrase => phrase !== toDelete)
            })
        );
    }

    addPhrase() {
        if (this.state.newPhrase !== '') {
            this.setState(state => ({
                phrases: [...state.phrases, state.newPhrase.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ")],
                newPhrase: ''
            }))
        }
    }

    setNewPhrase(e) {
        this.setState({
            newPhrase: e.target.value
        });
    }

    savePhrases() {
        this.props.saveRoomPlaylistPhrases(this.state.phrases);
        this.onClose();
    }

    hasChanges() {
        const initialPhrases = this.props.playlist.phrases || [];
        return !(initialPhrases.length === this.state.phrases.length &&
        this.state.phrases.every(phrase => initialPhrases.includes(phrase)))
    }

    render() {
        return (
            <Dialog open={this.state.open} onClose={this.onClose}>
                <DialogTitle id="playlist-phrase-dialog">Choose audio triggers that will start {this.props.playlist.name}</DialogTitle>
                <DialogContent>
                    <List>
                        {this.state.phrases.map(phrase => {
                            return (
                                <ListItem>
                                    <ListItemText primary={phrase}/>
                                    <IconButton onClick={this.removePhrase.bind(this, phrase)} edge="end">
                                        <Delete/>
                                    </IconButton>
                                </ListItem>
                            );
                        })}
                        <ListItem>
                            <TextField label="New Phrase" onChange={this.setNewPhrase} value={this.state.newPhrase} fullWidth/>
                            <IconButton onClick={this.addPhrase} edge="end" disabled={this.state.newPhrase === ''}>
                                <AddCircleOutline/>
                            </IconButton>
                        </ListItem>
                    </List>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.savePhrases} color="primary" disabled={!this.hasChanges()}>Save</Button>
                    <Button onClick={this.onClose} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
};

export default PlaylistPhraseDialog;