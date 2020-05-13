import React, { useState } from 'react';
import Question from '../Question';
import { socket, connect } from '../../socket';

export default function SoloGame() {
    // about game
    const [score, setScore] = useState(0);
    const [start, setStart] = useState(false);
    const [time, setTime] = useState(0);
    // about question
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([]);
    const [subject, setSubject] = useState('');
    const [subjectType, setSubjectType] = useState('');
    const [answersType, setAnswersType] = useState('');

    const handleAnswerClick = (index) => {
        socket.emit('answer', index);
    }

    const handleStart = () => {
        connect();
        setStart(true);
        socket.emit('startSoloGame');
        socket.on('testFinished', report => {
            console.log('finished');
            console.log('report:', report);
        })
        socket.on('time', time => {
            setTime(time);
        })
        socket.on('question', ({ question, time, score }) => {
            setTime(time);
            setScore(score);
            setText(question.text);
            setAnswers(question.answers);
            setSubject(question.subject);
            setSubjectType(question.meta.subjectType);
            setAnswersType(question.meta.answersType);
        })
    }

    if (start) {
        return (
            <div>
                <Question onAnswerClick={handleAnswerClick}
                    subjectType={subjectType}
                    answersType={answersType}
                    subject={subject}
                    answers={answers}
                    text={text} />
                <div>score: <span>{score}</span></div>
                <div>time: <span>{time}</span></div>
            </div>
        )
    }
    return (
        <div>
            <button onClick={handleStart}>Start</button>
        </div>
    )
}