import React from 'react';
import { Link } from 'react-router-dom';
export default function NavigationBar() {

    return (
        <div className="w-100">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link to="/home" >DOTA 2 GAME</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse">
                            <Link to="/home" >Home</Link>
                        </li>
                        <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse">
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse">
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li className="nav-item active" data-toggle="collapse" data-target=".navbar-collapse">
                            <Link onClick={() => localStorage.clear()} to="/login">Sign out</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

