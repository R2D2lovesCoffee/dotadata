import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import Question from './Question';

function Game({ type }) {
    const [time, setTime] = useState(0);
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([]);
    const [subject, setSubject] = useState('');
    const [subjectType, setSubjectType] = useState('');
    const [answersType, setAnswersType] = useState('');

    const handleAnswerClick = (index) => {
        socket.emit('answer', index);
    }

    useEffect(() => {
        socket.emit(type === 'solo' ? 'startSoloGame' : 'startRankedGame');
        socket.on('time', time => {
            setTime(time);
        });
        socket.on('question', question => {
            setText(question.text);
            setAnswers(question.answers);
            setSubject(question.subject);
            setSubjectType(question.meta.subjectType);
            setAnswersType(question.meta.answersType);
            socket.emit('ready');
        })

        socket.on('gameFinished', report => {
            console.log(report);
        })
    }, [])

    return (
        <div>
            <Question onAnswerClick={handleAnswerClick}
                subjectType={subjectType}
                answersType={answersType}
                subject={subject}
                answers={answers}
                text={text} />
            <br />
            <div>time: <span>{time}</span></div>
        </div>
    )
}

export default Game;