import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const login = () => {
        http.post('/login', {email, password})
        .then(resp => {
            if(resp.access_token) {
                localStorage.setItem('access_token', resp.access_token);
            }
        }).catch(error => {
            console.log(error);
            if(error.message) {
                setMessage(error.message);
            }
        })
    }

    return (
        <div>
            <div>
                <input value={email} onChange={handleEmailChange} placeholder="email" />
            </div>
            <div>
                <input value={password} onChange={handlePasswordChange} placeholder="password" type="password" />
            </div>
            <button onClick={login}>login</button>
            {/* <button onClick={() => localStorage.removeItem('access_token')}>logout</button> */}
        </div>
    )
}

export default Login;