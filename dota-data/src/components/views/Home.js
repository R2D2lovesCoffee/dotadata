import React, { useEffect } from 'react';
import Question from '../Question';
import { connect } from '../../socket';
function Home() {
    useEffect(() => {
        console.log('home');
        connect();
    }, [])
    return (
        <div>
            <Question />
        </div>
    )
}

export default Home;