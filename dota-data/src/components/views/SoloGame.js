import React, { useState, useEffect } from 'react';
import { socket, connect } from '../../socket';
import Report from '../Report';
import Game from '../Game';
import './Home.css';

export default function SoloGame() {
    const [start, setStart] = useState(false);
    const [finished, setFinished] = useState(false);
    const [report, setReport] = useState(0);

    useEffect(() => () => {
        socket.off('gameFinished');
    }, [])

    const handleStart = () => {
        setStart(true);
        socket.on('gameFinished', report => {
            setFinished(true);
            setReport(report);
        });
    }

    if (!finished) {
        if (start) {
            return (
                <>
                    <Game type={'solo'} />
                </>)
        }
        return (
            <div className="wrap">
                <button className='soloGame' onClick={handleStart}>Start</button>
            </div>
        )
    } else {
        return <Report data={report} />
    }
}