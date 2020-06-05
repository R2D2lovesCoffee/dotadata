import React from 'react';
import { useHistory } from "react-router-dom";

export default function Report({ data }) {
    // log la data pe solo si pe ranked si vezi cum arata ambele
    // componenta va arata diferit in functie de jocul jucat (solo sau ranked)
    const history = useHistory();
    const sendToHP = () => {
        history.push('/home');
    }

    return (
        <div>
            <h1>REPORT STATUS</h1>
            {/* <p>Score: {data.score}  </p> */}
            <p></p>
            <br />
            <button onClick={sendToHP}>Go to homepage</button>
        </div>
    )
}
