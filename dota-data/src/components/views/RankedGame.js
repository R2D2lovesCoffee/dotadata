import React, { useState, useEffect } from 'react';
import { socket, connect } from '../../socket';
import Game from '../Game';
import Timer from '../Timer';
import Report from '../Report';
import './Home.css';

function RankedGame() {
    const [start, setStart] = useState(false);
    const [message, setMessage] = useState('');
    const [opponent, setOpponent] = useState('');
    const [opponentScore, setOpponentScore] = useState(0);
    const [showTimer, setShowTimer] = useState(null);
    const [finished, setFinished] = useState(false);
    const [report, setReport] = useState(0);
    const [type, setType] = useState('ranked');

    useEffect(() => () => {
        socket.off('opponent');
        socket.off('opponentAnswer');
        socket.off('opponentScore');
        socket.off('gameFinished');
        socket.emit('stopFinding');
    }, [])

    const handleFindOpponent = () => {
        setMessage('We\'re finding you an opponent...');
        socket.emit('findOpponent');

        setShowTimer(true);
        socket.on('opponent', opponent => {
            setShowTimer(false);
            setOpponent(opponent);
            setStart(true);
        });
        socket.on('gameFinished', report => {
            setFinished(true);
            setReport(report);
            //console.log(report);
            setType(type);
        })
        socket.on('opponentAnswer', index => {
            console.log(index);
        })
        socket.on('opponentScore', score => setOpponentScore(score));

    }


    if (!finished) {
        return start === false ?
            <div className='wrapRank'>
                <button className="buttonDesign " onClick={handleFindOpponent}>Ready</button>
                <p>{message}</p>
                <span className="border border-secondary">
                    Time in queue: {showTimer ? <Timer /> : 0}
                </span>
            </div> :
            <>
                <p className='container' id='special'>Opponent: <span>{opponent}</span></p>
                <Game type={'ranked'} />
                <p className="container" id='special'>Opponent score: <span>{Number(opponentScore.toFixed(2))}</span></p>
            </>
    } else {
        return <Report dataRanked={report} type={type} />
    }

}

export default RankedGame;