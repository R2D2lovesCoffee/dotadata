import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';
import './Home.css';

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
                    localStorage.setItem('user_id', resp.user_id);
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
        <div className="container" id="spacing">
            <div>
                <h1 className="border-bottom border-secondary" id="heading">Login</h1>
                <div className="row">
                    <div className="col-25">
                        <label >Email</label>
                    </div>
                    <div className="col-75">
                        <input type='text' value={email} onChange={handleEmailChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25" >
                        <label >Password</label>
                    </div>
                    <div className="col-75">
                        <input value={password} onChange={handlePasswordChange} type="password" />
                    </div>
                </div>
                <div className='row container'>
                    <div id='centerText'>
                        {message}
                    </div>
                </div>
                <div className="row">
                    <button id="centerBtn" className="soloGame" onClick={login}>LOGIN</button>
                </div>
                <div id="left">
                    <div>
                        Don't have an account?
                    <button id="signupBtn" onClick={() => history.push('/register')}>SIGN UP</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;