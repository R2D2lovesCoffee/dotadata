import React, { useState } from 'react';
import axios from 'axios';
import { host } from '../config';
import Subject from './Subject';
import Answer from './Answer';

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
        axios.get(`${host}/random-question`)
            .then(resp => resp.data)
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