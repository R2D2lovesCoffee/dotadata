import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
function Home() {
    return (
        <div id="component-home">
            <div className="card card-play" id="card-solo-game">
                <img src={require('../../assets/images/1.jpeg')} alt=''></img>
                <p className="clickable">
                    <Link to="/solo-game">Play Solo</Link>
                </p>
            </div>
            <div className="card card-play" id="card-ranked-game">
                <img src={require('../../assets/images/2.jpeg')} alt=''></img>
                <p className="clickable">
                    <Link to="/ranked-game">Play ranked</Link>
                </p>
            </div>
        </div>
    )
}

export default Home;