import React from "react";
import {connect} from 'react-redux';
import {login, refreshSpotifyAccessToken} from "../redux/actionCreators/authActionCreators";
import {CircularProgress, Button} from "@material-ui/core";


class LoginGate extends React.Component {

    componentDidMount() {
        this.props.refreshSpotifyAccessToken();
    }

    render() {
        if (this.props.isLoggedIn) {
            return (
                <div>
                    {this.props.children}
                </div>
            )
        } else if (!this.props.verifiedLogin) {
            return <CircularProgress/>
        } else {
            return <Button variant="contained" onClick={this.props.login.bind(this)}>Login</Button>
        }
    }
};

export default connect(
    (state, ownProps) => {
        const {auth} = state;
        return {
            isLoggedIn: auth.isLoggedIn,
            verifiedLogin: auth.verifiedLogin
        }
    },
    (dispatch, ownProps) => ({
        refreshSpotifyAccessToken: () => dispatch(refreshSpotifyAccessToken()),
        login: () => dispatch(login)
    })
)(LoginGate);