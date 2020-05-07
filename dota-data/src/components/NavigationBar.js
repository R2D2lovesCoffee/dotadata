import React from 'react';
import { Link } from 'react-router-dom';
export default function NavigationBar() {

    return (
        <header>
            <div className="nav">
                <input type="checkbox" id="nav-check" />
                <div className="nav-header">
                    <div className="nav-title">
                        <Link to="/home">DOTA 2 GAME</Link>
                    </div>
                </div>
                <div className="nav-btn">
                    <label htmlFor="nav-check">
                        <span></span>
                        <span></span>
                        <span></span>
                    </label>
                </div>

                <div className="nav-links">
                    <Link to="/home">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/contact">Contact</Link>
                    <Link onClick={() => localStorage.clear()} to="/login">Sign out</Link>
                </div>
            </div>
        </header >
    );

}

// ReactDOM.render(<NavigationBar />, document.getElementById('root'));

