import {createSelector} from 'reselect';

export const authStateSelector = (state) => state.auth;
export const roomStateSelector = (state) => state.room;

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
)

export const currentRoomSelector = createSelector(
    [roomsSelector, profileNameSelector],
    (rooms, name) => rooms && rooms.find(room => room.attendees.includes(name))
)