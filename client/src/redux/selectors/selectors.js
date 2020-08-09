import {createSelector} from 'reselect';

export const authStateSelector = (state) => state.auth;
export const roomStateSelector = (state) => state.room;
export const spotifyStateSelector = (state) => state.spotify;

export const profileSelector = createSelector(
    [authStateSelector],
    (authState) => authState.profile
);

export const profileImageUrlSelector = createSelector(
    [profileSelector],
    (profile) => {
        if (
            profile &&
            profile.images &&
            profile.images.length > 0
        ) {
            return profile.images[0].url;
        }
        return null;
    }
);

export const profileNameSelector = createSelector(
    [profileSelector],
    (profile) => !!profile && profile.id || ''
);

export const roomsSelector = createSelector(
    [roomStateSelector],
    (roomState) => roomState.rooms
);

export const currentRoomSelector = createSelector(
    [roomsSelector, profileNameSelector],
    (rooms, name) => rooms && rooms.find(room => room.attendees.includes(name))
);

export const inviteRoomIdSelector = createSelector(
    [roomStateSelector],
    (roomState) => !roomState.rooms.some(room => room.id === roomState.inviteRoomId) && roomState.inviteRoomId
);

export const invitePasswordErrorSelector = createSelector(
    [roomStateSelector],
    (roomState) => roomState.invitePasswordError
);

export const playlistSelector = createSelector(
    [spotifyStateSelector],
    (spotifyState) => ({
        myPlaylists: spotifyState.myPlaylists,
        suggestedPlaylists: spotifyState.suggestedPlaylists
    })
);

export const roomPlaylistsSelector = createSelector(
    [roomStateSelector],
    (roomState) => roomState.roomPlaylists
);

export const spotifyAccessTokenSelector = createSelector(
    [spotifyStateSelector],
    (spotifyState) => spotifyState.accessToken
);

export const spotifyCurrentTrackSelector = createSelector(
    [spotifyStateSelector],
    (spotifyState) => spotifyState.currentTrack
);

export const spotifyCurrentPlaylistUriSelector = createSelector(
    [spotifyStateSelector],
    (spotifyState) => spotifyState.currentPlaylistUri
);