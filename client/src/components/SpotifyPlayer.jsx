import React from 'react';
import {connect} from 'react-redux';
import {registerBrowser} from "../redux/actionCreators/spotifyActionCreators";
import {spotifyAccessTokenSelector} from "../redux/selectors/selectors";

class SpotifyPlayer extends React.Component {

    componentDidMount() {

    }

    render () {
        return (
            <div></div>
        )
    }
}

export default connect(
    state => ({
        accessToken: spotifyAccessTokenSelector(state)
    }),
    dispatch => ({
        registerBrowser: (browserId) => dispatch(registerBrowser(browserId))
    })
)(SpotifyPlayer);