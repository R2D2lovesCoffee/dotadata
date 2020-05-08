import React, { useState, useEffect } from 'react';
import Subject from './Subject';
import Answer from './Answer';
import { socket } from '../socket';

export default function Question(props) {
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([]);
    const [subject, setSubject] = useState('');
    const [subjectType, setSubjectType] = useState('');
    const [answersType, setAnswersType] = useState('');
    const [score, setScore] = useState(0);
    const [start, setStart] = useState(false);
    const [time, setTime] = useState(0);

    const handleAnswerClick = (index) => {
        socket.emit('answer', index);
    }

    return (
        <div>
            <div>{text}</div>
            <Subject type={subjectType} content={subject} />
            <div>
                {answers.map((answer, index) => <Answer onAnswerClick={handleAnswerClick} key={index} index={index} type={answersType} content={answer} />)}
            </div>
            <div>
                <button hidden={start} onClick={() => {
                    setStart(true);
                    socket.emit('startSoloGame');
                    socket.on('testFinished', () => {
                        console.log('finished');
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
                }}>START</button>
            </div>
            <p>score: {score}</p>
            <p>time: {time}</p>
        </div>
    )
}