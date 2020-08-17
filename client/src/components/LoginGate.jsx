import React from "react";
import {connect} from 'react-redux';
import {login, refreshSpotifyAccessToken} from "../redux/actionCreators/authActionCreators";
import {
    CircularProgress,
    Button,
    Typography,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    DialogActions, Dialog
} from "@material-ui/core";
import {invitePasswordErrorSelector, inviteRoomIdSelector} from "../redux/selectors/selectors";
import {acceptRoomInvite, clearRoomInviteCookie, processRoomInvite} from "../redux/actionCreators/roomActionCreators";


class LoginGate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            invitePassword: ''
        }
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.joinRoom = this.joinRoom.bind(this);
    }

    handlePasswordChange(e) {
        this.setState({invitePassword: e.target.value});
    }

    joinRoom() {
        this.props.acceptRoomInvite(this.state.invitePassword);
    }

    componentDidMount() {
        this.props.refreshSpotifyAccessToken();
        window.setInterval(this.props.refreshSpotifyAccessToken,  1000 * 60 * 55); //1000 * 60 * 40
        this.props.processRoomInvite();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.inviteRoomId && !this.props.inviteRoomId) {
            this.props.clearRoomInviteCookie();
        }
    }

    renderInvitationDialog() {
        return (
            <Dialog open={!!this.props.inviteRoomId}>
                <DialogTitle id="create-new-room-dialog">Join the Party!</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="password"
                                label="Password"
                                type="password"
                                value={this.state.invitePassword}
                                error={!!this.props.invitePasswordError}
                                helperText={this.props.invitePasswordError}
                                fullWidth
                                onChange={this.handlePasswordChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.joinRoom} color="primary">Join!</Button>
                </DialogActions>
            </Dialog>
        )
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <React.Fragment>
                    {this.renderInvitationDialog()}
                    {this.props.children}
                </React.Fragment>
            )
        } else if (!this.props.verifiedLogin) {
            return <CircularProgress/>
        } else {
            return (
                <React.Fragment>
                    {this.props.inviteRoomId && <Typography>Looks like you got an invite!  Log in to accept it!</Typography>}
                    <Button variant="contained" onClick={this.props.login.bind(this)}>Login</Button>
                </React.Fragment>
            );
        }
    }
};

export default connect(
    (state, ownProps) => {
        const {auth} = state;
        return {
            isLoggedIn: auth.isLoggedIn,
            verifiedLogin: auth.verifiedLogin,
            inviteRoomId: inviteRoomIdSelector(state),
            invitePasswordError: invitePasswordErrorSelector(state)
        }
    },
    (dispatch, ownProps) => ({
        refreshSpotifyAccessToken: () => dispatch(refreshSpotifyAccessToken()),
        login: () => dispatch(login()),
        acceptRoomInvite: (password) => dispatch(acceptRoomInvite(password)),
        processRoomInvite: () => dispatch(processRoomInvite()),
        clearRoomInviteCookie: () => dispatch(clearRoomInviteCookie())
    })
)(LoginGate);