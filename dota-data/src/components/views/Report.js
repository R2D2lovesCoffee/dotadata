import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';

export default function ReportData() {

    const history = useHistory();

    const sendToHP = () => {
        history.push('/home');
    }

    return (
        <div>
            <h1>REPORT HERE TEST 123</h1>
            <p  >report: </p>
            <br />
            <button onClick={sendToHP}>Go to homepage</button>
        </div>
    )
}
