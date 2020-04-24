import React, { useEffect } from 'react';
import axios from 'axios';
import { host } from '../../config';

function Home() {

    useEffect(() => {
        axios.get(`${host}/api/heroes?name=Lina`).then(resp => resp.data)
            .then(data => console.log(data));
    })
    return (
        <div>
            home
        </div>
    )
}

export default Home;