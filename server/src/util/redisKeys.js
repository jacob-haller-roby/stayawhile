export default {
    accessTokenKey: (userId) => `access_token:${userId}`, //string
    refreshToken: (userId) => `refresh_token:${userId}`, //string
    //userId: (refreshToken) => `user_id:${refreshToken}`, //string
    roomIdCounter: () => `room_id_counter`, //string
    roomId: (roomId) => `room:${roomId}`, //hash
    userRooms: (userId) => `user_rooms:${userId}`, //set
    userCurrentRoom: (userId) => `user_current_room:${userId}`, //string
    roomAttendees: (roomId) => `room_attendees:${roomId}`, //set
    roomParticipants: (roomId) => `room_participants:${roomId}`, //set
    roomPlaylists: (roomId) => `room_playlists:${roomId}`, //set
    roomPlaylistPhrases: (roomId, playlistId) => `room_playlist_phrases:${roomId}:${playlistId}`, //set
    playlist: (playlistId) => `playlist:${playlistId}`, //hash
    device: (userId) => `device:${userId}`, //string
    currentTrack: (roomId) => `current_track:${roomId}`, //hash
    userDetails: (userId) => `user_details:${userId}` //hash
}