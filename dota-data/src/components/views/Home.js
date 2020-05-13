import React, { useEffect } from 'react';
import Question from '../Question';
import { connect } from '../../socket';
function Home() {
    // useEffect(() => {
    //     connect();
    // }, [])
    return (
        <div>
            Home Page
        </div>
    )
}

export default Home;