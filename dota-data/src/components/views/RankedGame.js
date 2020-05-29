import React, { useState, useEffect } from 'react';
import { socket, connect } from '../../socket';
import Game from '../Game';

function RankedGame() {
    const [start, setStart] = useState(false);
    const [message, setMessage] = useState('');
    const [timeWaiting, setTimeWaiting] = useState(0);

    useEffect(() => {
        // setTimeWaiting(timeWaiting + 1);
        if (timeWaiting) {
            setTimeout(() => {
                setTimeWaiting(timeWaiting + 1);
            }, 1000);
        }
    }, [timeWaiting])

    const handleFindOpponent = () => {
        connect();
        setMessage('We\'re find you an opponent...');
        socket.emit('findOpponent');
        setTimeWaiting(timeWaiting + 1);
        socket.on('opponent', opponent => {
            console.log(opponent);
            setStart(true);
        });
    }

    return start === false ?
        <div>
            <button onClick={handleFindOpponent}>Ready</button>
            <p>{message}</p>
            <p>Time in queue:<span>{timeWaiting}</span></p>
        </div> :
        <Game type={'ranked'} />
}

export default RankedGame;