import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
function Home() {
    return (
        <div className="container" id="component-home">

            <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="card card-inverse card-primary text-center card-play" id="card-solo-game">
                        <img className="card-img-top" src={require('../../assets/images/2.jpeg')} alt='' />
                        <div className="card-block">
                            <p className="clickable">
                                <Link to="/solo-game">Play Solo</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div className="card card-inverse card-primary text-center card-play" id="card-ranked-game">
                        <img className="card-img-top" src={require('../../assets/images/1.jpeg')} alt='' />
                        <div className="card-block">
                            <p className="clickable">
                                <Link to="/ranked-game">Play Ranked</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;