import React from 'react';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import {FormControlLabel, Switch, Tooltip} from "@material-ui/core";

export const isChrome = () => {
    return !!window.chrome && !isChromium();
};

export const isChromium = () => {
    return Array(...navigator.plugins).some(plugin => plugin.name && plugin.name.startsWith("Chromium"));
}

const VoiceListener = ({commands}) => {
    const {transcript} = useSpeechRecognition({commands});
    const toggleSpeechRecognition = (e) => {
        if (e.target.checked) {
            SpeechRecognition.startListening({continuous: true});
        } else {
            SpeechRecognition.stopListening();
        }
    }
    let Wrapper = React.Fragment;
    if(!isChrome()) {
        Wrapper = Tooltip;
    }
    return (
        <Wrapper title="Voice Activation is only compatible with Chrome browsers">
            <FormControlLabel
                value="top"
                control={<Switch color="primary" onChange={toggleSpeechRecognition}/>}
                label="Voice Activation"
                labelPlacement="Start"
                disabled={!isChrome()}
            />
        </Wrapper>
    )
}

export default VoiceListener;