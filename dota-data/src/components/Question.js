import React, { useState, useEffect } from 'react';
import Subject from './Subject';
import Answer from './Answer';
import { socket } from '../socket';

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