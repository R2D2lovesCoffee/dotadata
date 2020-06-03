import React from 'react';
import { useHistory } from "react-router-dom";

export default function ReportData({ data }) {

    const history = useHistory();
    console.log(data);
    const sendToHP = () => {
        history.push('/home');
    }

    return (
        <div>
            <h1>REPORT STATUS</h1>
            <p>Score: {data.score}  </p>
            <p></p>
            <br />
            <button onClick={sendToHP}>Go to homepage</button>
        </div>
    )
}
