import React from 'react';
// import ReactDOM from 'react-dom';
import { Link, BrowserRouter, Redirect } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
export default function NavigationBar() {

    return (
        <header>
            <div className="nav">
                <input type="checkbox" id="nav-check" />
                <div className="nav-header">
                    <div className="nav-title">
                        DOTA 2 GAME
                    </div>
                </div>
                <div className="nav-btn">
                    <label for="nav-check">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                </div>

                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </header >
    );

}

// ReactDOM.render(<NavigationBar />, document.getElementById('root'));

