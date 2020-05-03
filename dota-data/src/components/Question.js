import React, { useState } from 'react';
import Subject from './Subject';
import Answer from './Answer';
import http from '../http';

export default function Question(props) {
    const [text, setText] = useState('');
    const [answers, setAnswers] = useState([]);
    const [subject, setSubject] = useState('');
    const [subjectType, setSubjectType] = useState('');
    const [answersType, setAnswersType] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState(-1);
    const [score, setScore] = useState(0);
    const [start, setStart] = useState(false);

    const getQuestion = () => {
        http.get('/random-question')
            .then(data => {
                setCorrectAnswer(data.correctAnswer);
                setText(data.text);
                setAnswers(data.answers);
                setSubject(data.subject);
                setSubjectType(data.meta.subjectType);
                setAnswersType(data.meta.answersType);
            })
    }

    const handleAnswerClick = (index) => {
        if (index === correctAnswer) {
            setScore(score + 1);
        }
        getQuestion();
    }

    return (
        <div>
            <p>ceva de genul</p>
            <h1>titlu</h1>
            <ol>
                <li>mere</li>
                <li>pere</li>
                <li>prune</li>
            </ol>
            <ul>
                <li>dota</li>
                <li>dotka</li>
                <li>vodka</li>
            </ul>
            <div>{text}</div>
            <Subject type={subjectType} content={subject} />
            <div>
                {answers.map((answer, index) => <Answer onAnswerClick={handleAnswerClick} key={index} index={index} type={answersType} content={answer} />)}
            </div>
            <div>
                <button hidden={start} onClick={() => {
                    setStart(true);
                    getQuestion();
                }}>START</button>
            </div>
            <p>score: {score}</p>
        </div>
    )
}