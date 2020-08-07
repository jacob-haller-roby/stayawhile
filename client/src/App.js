import React from 'react';
import './App.css';
import LoginGate from "./components/LoginGate";
import Header from "./components/Header";
import Router from "./components/Router";

class App extends React.Component {

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <LoginGate>
                        <Header/>
                        <Router/>
                    </LoginGate>
                </header>
            </div>
        );
    }
}

export default App;
