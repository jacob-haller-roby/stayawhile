import {registerBrowser, spotifyPlayerStateChange} from "../redux/actionCreators/spotifyActionCreators";
import store from "../redux/store";
import {spotifyAccessTokenSelector} from "../redux/selectors/selectors";

const playerManager = {};

playerManager.initialize = () => {
    if (playerManager.player) return;

    if (!window.Spotify || !spotifyAccessTokenSelector(store.getState())) {
        return window.setTimeout(() => playerManager.initialize(), 1000);
    }

    const player = new window.Spotify.Player({
        name: 'Stay A While: Spotify Web Player',
        getOAuthToken: cb => {
            cb(spotifyAccessTokenSelector(store.getState()));
        }
    });

// Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

// Playback status updates
    player.addListener('player_state_changed', state => {
        store.dispatch(spotifyPlayerStateChange(state))
    });

// Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        store.dispatch(registerBrowser(device_id));
    });

// Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

// Connect to the player!
    player.connect();
    playerManager.player = player;
};

playerManager.isInitialized = () => {
    return !!playerManager.player;
};

playerManager.getVolume = () => playerManager.isInitialized() && playerManager.player.getVolume();
playerManager.setVolume = (level) => playerManager.isInitialized() && playerManager.player.setVolume(level);
playerManager.togglePlay = () => playerManager.isInitialized() && playerManager.player.togglePlay();
playerManager.next = () => playerManager.isInitialized() && playerManager.player.nextTrack();
playerManager.prev = () => playerManager.isInitialized() && playerManager.player.previousTrack();

export default playerManager;