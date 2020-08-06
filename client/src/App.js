import React from 'react';
import './App.css';
import LoginGate from "./components/LoginGate";
import {Paper} from "@material-ui/core";
import Header from "./components/Header";

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <LoginGate>
                        <Header/>
                        <Paper>
                            You're logged in!
                        </Paper>
                    </LoginGate>
                </header>
            </div>
        );
    }
}

export default App;
