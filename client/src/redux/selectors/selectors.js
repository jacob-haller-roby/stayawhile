import {createSelector} from 'reselect';

export const getAuthState = (state) => state.auth;

export const getProfile = createSelector(
    [getAuthState],
    (authState) => authState.profile
);

export const getProfileImageUrl = createSelector(
    [getProfile],
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

export const getProfileName = createSelector(
    [getProfile],
    (profile) => !!profile && profile.display_name || ''
);