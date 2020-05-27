import React from 'react';
import Subject from './Subject';
import Answer from './Answer';

export default function Question({ onAnswerClick, subjectType, answersType, subject, answers, text }) {

    return (
        <div>
            <div>{text}</div>
            <Subject type={subjectType} content={subject} />
            <div>
                {answers.map((answer, index) => <Answer onAnswerClick={onAnswerClick} key={index} index={index} type={answersType} content={answer} />)}
            </div>
        </div>
    )
}