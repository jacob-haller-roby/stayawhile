import React from 'react';
import './App.css';
import LoginGate from "./components/LoginGate";
import Header from "./components/Header";
import Router from "./components/Router";
import SpotifyPlayer from "./components/SpotifyPlayer";

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div style={{flexGrow: 1, width: '90%'}}>
                        <LoginGate>
                            <Header/>
                            <div style={{marginTop: '80px', marginBottom: '120px'}}>
                                <Router/>
                            </div>
                        </LoginGate>
                    </div>
                    <SpotifyPlayer/>
                </header>
            </div>
        );
    }
}

export default App;
