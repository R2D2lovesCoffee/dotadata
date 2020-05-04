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
        http.post('/login', { email, password })
            .then(resp => {
                if (resp.access_token) {
                    localStorage.setItem('access_token', resp.access_token);
                    history.push('/home');
                }
            }).catch(error => {
                console.log(error);
                if (error.message) {
                    setMessage(error.message);
                }
            })
    }

    return (
        <div className="form">
            <input value={email} onChange={handleEmailChange} placeholder="email" />
            <input value={password} onChange={handlePasswordChange} placeholder="password" type="password" />
            <button onClick={login}>login</button>
            <div>
                Don't have an account?
                <button onClick={() => history.push('/register')}>SIGN UP</button>
            </div>
            <p>{message}</p>
        </div>
    )
}

export default Login;