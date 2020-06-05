import React, { useState, useEffect } from 'react';

export default function Timer() {
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => timer + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span>{timer}</span>
}