import React, { useState, useEffect } from 'react';
import { socket } from '../../socket';
import Game from '../Game';
import Timer from '../Timer';
import Report from '../Report';
import http from '../../http';
import './Home.css';

function RankedGame() {
    const [start, setStart] = useState(false);
    const [message, setMessage] = useState('');
    const [opponentNickname, setOpponentNickname] = useState('');
    const [opponentScore, setOpponentScore] = useState(0);
    const [showTimer, setShowTimer] = useState(null);
    const [finished, setFinished] = useState(false);
    const [report, setReport] = useState(0);
    const [type, setType] = useState('ranked');
    const [finding, setFinding] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [personalNickname, setPersonalNickname] = useState('');
    const [personalImg, setPersonalImg] = useState('');

    useEffect(() => () => {
        socket.off('opponent');
        // socket.off('opponentAnswer');
        socket.off('opponentScore');
        socket.off('gameFinished');
        socket.emit('stopFinding');
    }, [])

    const handleFindOpponent = () => {

        http.get('/ranked-game')
            .then(data => {
                setPersonalNickname(data.nickname);
            })

        setFinding(true);
        setMessage('We\'re finding you an opponent...');
        socket.emit('findOpponent');

        setShowTimer(true);
        socket.on('opponent', opponent => {
            http.loadImage(opponent.id)
                .then(src => {
                    setImgSrc(src);
                })
            http.loadImage(localStorage.getItem('user_id'))
                .then(personalSrc => {
                    setPersonalImg(personalSrc);
                })
            setShowTimer(false);
            setOpponentNickname(opponent.nickname);
            setStart(true);
        });
        socket.on('gameFinished', report => {
            setFinished(true);
            setReport(report);
            setType(type);
        })
        // socket.on('opponentAnswer', index => {
        //     console.log(index);
        // })
        socket.on('opponentScore', score => {
            setOpponentScore(score);
        });
    }

    const handleStopFinding = () => {
        setFinding(false);
        setShowTimer(false);
        setMessage('');
        socket.emit('stopFinding');
    }

    if (!finished) {
        return start === false ?
            <div className='wrapRank'>
                <button className="buttonDesign" disabled={finding} onClick={handleFindOpponent}>Ready</button>
                <button className="buttonDesign" id="marginLeft" disabled={!finding} onClick={handleStopFinding}>Stop Seaching</button>
                <p>{message}</p>
                <span className="border border-secondary">
                    Time in queue: {showTimer ? <Timer /> : 0}
                </span>
            </div> :
            <>
                <div className="container" id="special">
                    <div className="row">
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <img id="rankedPicture" src={imgSrc} alt="" />
                            {opponentNickname}
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            VS
                        </div>
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4">
                            <img id="rankedPicture" src={personalImg} alt="" />
                            {personalNickname}
                        </div>
                    </div>
                </div>
                <Game type={'ranked'} />
                <p className="container" id="special">Opponent score: <span>{Number(opponentScore.toFixed(2))}</span></p>
            </>
    } else {
        return <Report dataRanked={report} type={type} />
    }
}

export default RankedGame;