import {registerBrowser, spotifyPlayerStateChange} from "../redux/actionCreators/spotifyActionCreators";
import store from "../redux/store";

const initialize = (accessToken) => {
    if (!window.Spotify) {
        window.setTimeout(() => initialize(accessToken), 1000);
    }

    const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: cb => { cb(accessToken); }
    });

// Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); console.error('accessToken is:' + accessToken) });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

// Playback status updates
    player.addListener('player_state_changed', state => {
        console.log(state);
        store.dispatch(spotifyPlayerStateChange(state))
    });

// Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        store.dispatch(registerBrowser(device_id))
    });

// Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

// Connect to the player!
    player.connect();
};

export default initialize;