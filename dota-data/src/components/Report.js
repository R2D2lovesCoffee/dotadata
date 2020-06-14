import React from 'react';
import { useHistory } from "react-router-dom";
import '../App.css';

export default function Report(props) {

    const history = useHistory();
    const sendToHP = () => {
        history.push('/home');
    }

    let contor = 0;
    let percentage = 0;

    let situation = '';
    let personalRankedContor = 0;
    let personalRankedPercentage = 0;
    let opponentRankedContor = 0;
    let opponentRankedPercentage = 0;

    let soloCustomizeMessage = '';
    let rankedPersonalCustomizeMessage = '';

    if (props.data === 0 || props.data === null || props.data === 'undefined' || props.dataRanked === 0 || props.dataRanked === null || props.dataRanked === 'undefined') {
        return null;
    } else {
        if (props.type === 'solo') {

            for (let i = 0; i < props.data.questions.length; i++) {
                if (props.data.answers[i] === props.data.questions[i].correct) {
                    contor++;
                }
            }

            switch (contor) {
                case 0:
                    soloCustomizeMessage = 'Are you even trying?';
                    break;
                case 1:
                case 2:
                    soloCustomizeMessage = 'What have you done?';
                    break;
                case 3:
                case 4:
                    soloCustomizeMessage = 'Close, but not that close. Better luck next time.';
                    break;
                case 5:
                case 6:
                    soloCustomizeMessage = 'Now that\'s what I\'m almost talking about!';
                    break;
                case 7:
                    soloCustomizeMessage = 'Now that\'s more like it.';
                    break;
                case 8:
                    soloCustomizeMessage = 'Nice, master! The only one surprised by this is you.';
                    break;
                default:
                    break;
            }

            percentage = (contor / props.data.questions.length) * 100;

            return (
                <div className="container" id='special'>
                    <h1 id='special'>SOLO STATUS</h1>
                    <p>Numeric score: {props.data.score} </p>
                    <p>
                        Score: {contor}/{props.data.questions.length}
                        <span id='msg'>{soloCustomizeMessage}</span>
                    </p>
                    <p>Percentage: {percentage}%</p>
                    <button className="buttonDesign" id='hpBtn' onClick={sendToHP}>Go to homepage</button>
                </div>
            )
        } else if (props.type === 'ranked') {

            for (let i = 0; i < props.dataRanked.questions.length; i++) {
                if (props.dataRanked.myAnswers[i] === props.dataRanked.questions[i].correct) {
                    personalRankedContor++;
                }
            }

            switch (personalRankedContor) {
                case 0:
                    rankedPersonalCustomizeMessage = 'Are you even trying?';
                    break;
                case 1:
                case 2:
                    rankedPersonalCustomizeMessage = 'What have you done?';
                    break;
                case 3:
                case 4:
                    rankedPersonalCustomizeMessage = 'Close, but not that close. Better luck next time.';
                    break;
                case 5:
                case 6:
                    rankedPersonalCustomizeMessage = 'Now that\'s what I\'m almost talking about!';
                    break;
                case 7:
                    rankedPersonalCustomizeMessage = 'Now that\'s more like it.';
                    break;
                case 8:
                    rankedPersonalCustomizeMessage = 'Nice, master! The only one surprised by this is you.';
                    break;
                default:
                    break;
            }

            personalRankedPercentage = (personalRankedContor / props.dataRanked.myAnswers.length) * 100;

            for (let i = 0; i < props.dataRanked.questions.length; i++) {
                if (props.dataRanked.opponentAnswers[i] === props.dataRanked.questions[i].correct) {
                    opponentRankedContor++;
                }
            }

            opponentRankedPercentage = (opponentRankedContor / props.dataRanked.opponentAnswers.length) * 100;

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
                <div className="container" id='special'>
                    <h1>RANKED STATUS</h1>
                    <h1 style={{ color: specific }}> {situation} </h1>
                    <p>My numeric score: {props.dataRanked.myScore} </p>
                    <p>Opponent's numeric score: {props.dataRanked.opponentScore}</p>
                    <p>My score: {personalRankedContor}/{props.dataRanked.myAnswers.length}
                        <span id='msg'> {rankedPersonalCustomizeMessage} </span>
                    </p>
                    <p>
                        My percentage: {personalRankedPercentage}%
                    </p>
                    <p>Opponent's score: {opponentRankedContor}/{props.dataRanked.opponentAnswers.length}
                    </p>
                    <p>Opponent's percentage: {opponentRankedPercentage}% </p>
                    <button className="buttonDesign" id='hpBtn' onClick={sendToHP}>Go to homepage</button>
                    <button className="buttonDesign" id='hpBtn'>Rematch</button>
                </div>
            )
        }
    }


}
