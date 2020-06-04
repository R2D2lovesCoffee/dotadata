import React, { useState, useEffect } from 'react';
import { socket, connect } from '../../socket';
import Game from '../Game';
import './Home.css';

function RankedGame() {
    const [start, setStart] = useState(false);
    const [message, setMessage] = useState('');
    const [timeWaiting, setTimeWaiting] = useState(0);
    const [opponent, setOpponent] = useState('');
    const [opponentScore, setOpponentScore] = useState(0);

    useEffect(() => {
        if (timeWaiting) {
            setTimeout(() => {
                setTimeWaiting(timeWaiting + 1);
            }, 1000);
        }
    }, [timeWaiting])

    const handleFindOpponent = () => {
        setMessage('We\'re find you an opponent...');
        socket.emit('findOpponent');
        setTimeWaiting(timeWaiting + 1);
        socket.on('opponent', opponent => {
            setOpponent(opponent);
            setStart(true);
        });
        socket.on('opponentAnswer', index => {
            console.log(index);
        })
        socket.on('opponentScore', score => setOpponentScore(score));
    }

    return start === false ?
        <div>
            <button class="rankedGame" onClick={handleFindOpponent}>Ready</button>
            <p>{message}</p>
            <p>Time in queue:<span>{timeWaiting}</span></p>
        </div> :
        <>
            <Game type={'ranked'} />
            <p>Opponent score: <span>{opponentScore}</span></p>
        </>

}

export default RankedGame;