import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';
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

    const responseFacebook = (resp) => {
        console.log(resp);
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
            <FacebookLogin
                appId="1237835009752812"
                fields="name,email,picture"
                // onClick={componentClicked}
                callback={responseFacebook} />
            <p>{message}</p>
        </div>
    )
}

export default Login;