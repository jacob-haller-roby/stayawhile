import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@material-ui/core";
import {Chat} from "@material-ui/icons";

class SpeechLogDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({open: true})
    }

    close() {
        this.setState({open: false});
    }

    renderDialog() {
        return (
            <Dialog open={this.state.open} onClose={this.close} maxWidth="lg">
                <DialogTitle id="speech-log-dialog">Speech Log</DialogTitle>
                <DialogContent>
                    {this.props.speechLog.map(speech => <p>{speech}</p>)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.close} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
        );
    }

    render() {
        return (
            <React.Fragment>
                <IconButton onClick={this.open}>
                    <Chat/>
                </IconButton>
                {this.renderDialog()}
            </React.Fragment>
        );
    }
};

export default SpeechLogDialog;