import React, { useState } from 'react';
import { socket, connect } from '../../socket';
import ReportData from './Report';
import Game from '../Game';

export default function SoloGame() {
    const [start, setStart] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [report, setReport] = useState(0);

    const handleStart = () => {
        connect();
        setStart(true);
        socket.on('testFinished', report => {
            setFinished(true);
            setReport(report);
        });
        socket.on('score', received => setScore(received));
    }

    if (!finished) {
        if (start) {
            return (
                <>
                    <Game type={'solo'} />
                    <p>score: <span>{score}</span></p>
                </>)
        }
        return (
            <div>
                <button onClick={handleStart}>Start</button>
            </div>
        )
    } else {
        return <ReportData data={report} />
    }
}