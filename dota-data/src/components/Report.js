import React from 'react';
import { useHistory } from "react-router-dom";
import '../App.css';

export default function Report(props) {

    console.log(props);
    const history = useHistory();
    const sendToHP = () => {
        history.push('/home');
    }

    if (props.data === 0 || props.data === null || props.data === 'undefined' || props.dataRanked === 0 || props.dataRanked === null || props.dataRanked === 'undefined') {
        return null;
    } else {
        if (props.type === 'solo') {
            var contor = 0;
            var percentage = 0;

            for (var i = 0; i < props.data.questions.length; i++) {
                if (props.data.answers[i] === props.data.questions[i].correct) {
                    contor++;
                }
            }

            percentage = (contor / props.data.questions.length) * 100 + '%';

            return (
                <div className="container">
                    <h1>SOLO STATUS</h1>
                    <p>Numeric score: {props.data.score} </p>
                    <p>
                        Score: {contor}/{props.data.questions.length}
                    </p>
                    <p>Percentage: {percentage}</p>
                    <button className="buttonDesign" onClick={sendToHP}>Go to homepage</button>
                </div>
            )
        } else if (props.type === 'ranked') {

            var situation = 0;
            var personalRankedContor = 0;
            var personalRankedPercentage = 0;
            var opponentRankedContor = 0;
            var opponentRankedPercentage = 0;

            for (var z = 0; z < props.dataRanked.questions.length; z++) {
                if (props.dataRanked.myAnswers[z] === props.dataRanked.questions[z].correct) {
                    personalRankedContor++;
                }
            }

            personalRankedPercentage = (personalRankedContor / props.dataRanked.myAnswers.length) * 100 + '%';

            for (var j = 0; j < props.dataRanked.questions.length; j++) {
                if (props.dataRanked.opponentAnswers[j] === props.dataRanked.questions[j].correct) {
                    opponentRankedContor++;
                }
            }

            opponentRankedPercentage = (opponentRankedContor / props.dataRanked.opponentAnswers.length) * 100 + '%';

            if (props.dataRanked.opponentScore < props.dataRanked.myScore) {
                situation = 'You\'ve won!'
            } else if (props.dataRanked.opponentScore > props.dataRanked.myScore) {
                situation = 'You\'ve lost!';
            } else if (props.dataRanked.myScore === props.dataRanked.opponentScore) {
                situation = 'Equal!';
            }

            let specific = '';

            if (situation === 'You\'ve won!') {
                specific = 'green';
            }
            if (situation === 'You\'ve lost!') {
                specific = 'red';
            }
            if (situation === 'Equal!') {
                specific = '#d9d9d9';
            }


            return (
                <div className="container">
                    <h1>RANKED STATUS</h1>
                    <h1 style={{ color: specific }}> {situation} </h1>
                    <p>My numeric score: {props.dataRanked.myScore} </p>
                    <p>Opponent's numeric score: {props.dataRanked.opponentScore}</p>
                    <p>My score: {personalRankedContor}/{props.dataRanked.myAnswers.length} </p>
                    <p>
                        My percentage: {personalRankedPercentage}
                    </p>
                    <p>Opponent's score: {opponentRankedContor}/{props.dataRanked.opponentAnswers.length} </p>
                    <p>Opponent's percentage: {opponentRankedPercentage} </p>
                    <button className="buttonDesign" onClick={sendToHP}>Go to homepage</button>
                </div>
            )
        }
    }


}
