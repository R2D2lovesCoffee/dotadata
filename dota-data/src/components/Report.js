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
            if (props.data.answers[0] === props.data.questions[0].correct) {
                contor++;
            }
            if (props.data.answers[1] === props.data.questions[1].correct) {
                contor++;
            }
            if (props.data.answers[2] === props.data.questions[2].correct) {
                contor++;
            }
            if (props.data.answers[3] === props.data.questions[3].correct) {
                contor++;
            }
            if (props.data.answers[4] === props.data.questions[4].correct) {
                contor++;
            }

            switch (contor) {
                case 0:
                    percentage = '0%';
                    break;
                case 1:
                    percentage = '20%';
                    break;
                case 2:
                    percentage = '40%';
                    break;
                case 3:
                    percentage = '60%';
                    break;
                case 4:
                    percentage = '80%';
                    break;
                case 5:
                    percentage = '100%';
                    break;
                default:
                    break;
            }

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

            var personalRankedContor = 0;
            var personalRankedPercentage = 0;
            var opponentRankedContor = 0;
            var opponentRankedPercentage = 0;

            if (props.dataRanked.myAnswers[0] === props.dataRanked.questions[0].correct) {
                personalRankedContor++;
            }
            if (props.dataRanked.myAnswers[1] === props.dataRanked.questions[1].correct) {
                personalRankedContor++;
            }
            if (props.dataRanked.myAnswers[2] === props.dataRanked.questions[2].correct) {
                personalRankedContor++;
            }
            if (props.dataRanked.myAnswers[3] === props.dataRanked.questions[3].correct) {
                personalRankedContor++;
            }
            if (props.dataRanked.myAnswers[4] === props.dataRanked.questions[4].correct) {
                personalRankedContor++;
            }

            switch (personalRankedContor) {
                case 0:
                    personalRankedPercentage = '0%';
                    break;
                case 1:
                    personalRankedPercentage = '20%';
                    break;
                case 2:
                    personalRankedPercentage = '40%';
                    break;
                case 3:
                    personalRankedPercentage = '60%';
                    break;
                case 4:
                    personalRankedPercentage = '80%';
                    break;
                case 5:
                    personalRankedPercentage = '100%';
                    break;
                default:
                    break;
            }

            if (props.dataRanked.opponentAnswers[0] === props.dataRanked.questions[0].correct) {
                opponentRankedContor++;
            }
            if (props.dataRanked.opponentAnswers[1] === props.dataRanked.questions[1].correct) {
                opponentRankedContor++;
            }
            if (props.dataRanked.opponentAnswers[2] === props.dataRanked.questions[2].correct) {
                opponentRankedContor++;
            }
            if (props.dataRanked.opponentAnswers[3] === props.dataRanked.questions[3].correct) {
                opponentRankedContor++;
            }
            if (props.dataRanked.opponentAnswers[4] === props.dataRanked.questions[4].correct) {
                opponentRankedContor++;
            }

            switch (opponentRankedContor) {
                case 0:
                    opponentRankedPercentage = '0%';
                    break;
                case 1:
                    opponentRankedPercentage = '20%';
                    break;
                case 2:
                    opponentRankedPercentage = '40%';
                    break;
                case 3:
                    opponentRankedPercentage = '60%';
                    break;
                case 4:
                    opponentRankedPercentage = '80%';
                    break;
                case 5:
                    opponentRankedPercentage = '100%';
                    break;
                default:
                    break;
            }

            return (
                <div className="container">
                    <h1>RANKED STATUS</h1>
                    <p>My numeric score: {props.dataRanked.myScore} </p>
                    <p>Opponent's numeric score: {props.dataRanked.opponentScore}</p>
                    <p>My score: {personalRankedContor}/{props.dataRanked.questions.length} </p>
                    <p>
                        My percentage: {personalRankedPercentage}
                    </p>
                    <p>Opponent's score: {opponentRankedContor}/{props.dataRanked.questions.length} </p>
                    <p>Opponent's percentage: {opponentRankedPercentage} </p>
                    <button className="buttonDesign" onClick={sendToHP}>Go to homepage</button>
                </div>
            )
        }
    }


}
