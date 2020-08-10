import React from 'react';
import {connect} from 'react-redux';
import {IconButton, Paper} from '@material-ui/core';
import {Pause, PlayArrow, SkipNext, SkipPrevious} from "@material-ui/icons";
import {isOwnerSelector, spotifyCurrentTrackSelector, spotifyIsPlayingSelector} from "../redux/selectors/selectors";
import {spotifyNext, spotifyPauseOrPlay, spotifyPrevious} from "../redux/actionCreators/spotifyActionCreators";

const fontStyle = {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: 'initial',
    color: 'white',
    marginBlockStart: 0,
    marginBlockEnd: 0,
    marginInlineEnd: 0,
    marginInlineStart: 0
}

class SpotifyPlayer extends React.Component {

    render() {
        if (!this.props.currentTrack.uri || this.props.currentTrack.uri === 'spotify:track:2bNCdW4rLnCTzgqUXTTDO1') {
            return null;
        }

        return (
            <Paper square elevation={24} style={{
                background: 'linear-gradient(0deg, rgba(24,24,24,1) 61%, rgba(149,149,149,1) 95%)',
                position: 'fixed',
                bottom: 0,
                width: '100%',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{width: '80px', height: '80px'}}>
                    <img src={this.props.currentTrack.album.images[0].url}
                         style={{height: '80px', width: '80px'}}/>
                </div>
                <div style={{flex: 1, textAlign: 'left', paddingLeft: '10px'}}>
                    <React.Fragment>
                        <p style={fontStyle}>{this.props.currentTrack.name}</p>
                        <p style={fontStyle}>{this.props.currentTrack.artists.map(artist => artist.name).join(' & ')}</p>
                        <p style={fontStyle}>{this.props.currentTrack.album.name}</p>
                    </React.Fragment>
                </div>
                {
                    this.props.isOwner &&
                    <IconButton onClick={this.props.previous}>
                        <SkipPrevious style={{color: "gray"}}/>
                    </IconButton>
                }
                <IconButton onClick={this.props.pauseOrPlay}>
                    {this.props.isPlaying ? <Pause style={{color: "gray"}}/> : <PlayArrow style={{color: "gray"}}/>}
                </IconButton>
                {
                    this.props.isOwner &&
                    <IconButton onClick={this.props.next}>
                        <SkipNext style={{color: "gray"}}/>
                    </IconButton>
                }
                <div style={{flex: 1}}>
                </div>
                <div style={{width: '80px', height: '80px'}}/>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        isOwner: isOwnerSelector(state),
        currentTrack: spotifyCurrentTrackSelector(state),
        isPlaying: spotifyIsPlayingSelector(state)
    }),
    dispatch => ({
        next: () => dispatch(spotifyNext()),
        previous: () => dispatch(spotifyPrevious()),
        pauseOrPlay: () => dispatch(spotifyPauseOrPlay())
    })
)(SpotifyPlayer);