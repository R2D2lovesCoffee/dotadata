import React, { useEffect } from 'react';
import Question from '../Question';
import { socket, connect } from '../../socket';
function Home() {
    useEffect(() => {
        connect();
    })
    return (
        <div>
            <Question />
        </div>
    )
}

export default Home;