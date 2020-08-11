import React from 'react';
import {connect} from 'react-redux';
import {IconButton, Paper, Slider} from '@material-ui/core';
import {
    Pause,
    PlayArrow,
    SkipNext,
    SkipPrevious,
    VolumeDown,
    VolumeMute,
    VolumeOff,
    VolumeUp
} from "@material-ui/icons";
import {
    isOwnerSelector,
    spotifyCurrentTrackSelector,
    spotifyIsPlayingSelector,
    spotifyVolumeSelector,
} from "../redux/selectors/selectors";
import {
    spotifyNext,
    spotifyPauseOrPlay,
    spotifyPrevious,
    spotifySetVolume
} from "../redux/actionCreators/spotifyActionCreators";

const fontStyle = {
    textOverflow: 'ellipsis',
    overflow: 'inherit',
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
                <div style={{width: '50%', flexShrink: 1, alignItems: 'center', display: 'flex', overflow: 'hidden'}}>
                    <div style={{width: '80px', height: '80px'}}>
                        <img src={this.props.currentTrack.album.images[0].url}
                             style={{height: '80px', width: '80px'}}/>
                    </div>
                    <div style={{flex: 1, textAlign: 'left', paddingLeft: '10px', overflow: 'inherit'}}>
                        <React.Fragment>
                            <p style={fontStyle}>{this.props.currentTrack.name}</p>
                            <p style={fontStyle}>{this.props.currentTrack.artists.map(artist => artist.name).join(' & ')}</p>
                            <p style={fontStyle}>{this.props.currentTrack.album.name}</p>
                        </React.Fragment>
                    </div>
                </div>
                <div style={{flexShrink: 0, textAlign: 'center'}}>
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
                </div>
                <div style={{width: '50%', flexShrink: 1, textAlign: 'end', display: 'flex', justifyContent: 'flex-end'}}>
                        <div style={{maxWidth: '200px', paddingLeft: '10px', paddingRight: '10px', alignItems: 'center', display: 'flex', marginLeft: 'auto', flex: 1}}>
                            {this.props.volume ? <VolumeDown style={{flex: 1, color: "gray"}}/> : <VolumeOff style={{flex: 1, color: "gray"}}/>}
                            <Slider
                                defaultValue={this.props.volume * 100}
                                aria-labelledby="volume-slider"
                                step={2}
                                min={0}
                                max={100}
                                style={{flex: 3, color: "gray"}}
                                onChange={(e, value) => this.props.setVolume(value/100)}
                            />
                            <VolumeUp style={{flex: 1, color: "gray"}}/>
                        </div>
                </div>
            </Paper>
        )
    }
}

export default connect(
    state => ({
        isOwner: isOwnerSelector(state),
        currentTrack: spotifyCurrentTrackSelector(state),
        isPlaying: spotifyIsPlayingSelector(state),
        volume: spotifyVolumeSelector(state)
    }),
    dispatch => ({
        next: () => dispatch(spotifyNext()),
        previous: () => dispatch(spotifyPrevious()),
        pauseOrPlay: () => dispatch(spotifyPauseOrPlay()),
        setVolume: (level) => dispatch(spotifySetVolume(level))
    })
)(SpotifyPlayer);