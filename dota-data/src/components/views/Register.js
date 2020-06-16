import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';

function Register() {
    //let emailMessage = '';
    //let passwordMessage = '';
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [emailMessage, setEmailMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const register = () => {
        if (email.indexOf('@') === -1) {
            setEmailMessage('Email is not correct');
            console.log(emailMessage);
        }
        if (password.length <= 8) {
            setPasswordMessage('Password must have at least 8 characters');
            console.log(passwordMessage)
        }
        if (password === confirmPassword) {
            http.post('/register', { email, password })
                .then(resp => {
                    //history.push('/login');
                }).catch(error => {
                    console.log(error);
                    if (error.message) {
                        setMessage(error.message);
                    }
                })
        }
    }

    return (
        <div className="container" id="spacing">
            <div>
                <h1 className="border-bottom border-secondary" id="heading">Welcome to our game!</h1>
                <div className="row">
                    <div className="col-25">
                        <label>Email</label>
                    </div>
                    <div className="col-75">
                        <input type='text' value={email} required onChange={handleEmailChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Password</label>
                    </div>
                    <div className="col-75">
                        <input value={password} type="password" onChange={handlePasswordChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-25">
                        <label>Confirm Password</label>
                    </div>
                    <div className="col-75">
                        <input value={confirmPassword} type="password" onChange={handleConfirmPasswordChange} />
                    </div>
                </div>
                <div className="row">
                    <button id="centerBtn" className="soloGame" onClick={register} >REGISTER</button>
                </div>
                <div>
                    {message}
                </div>

                {emailMessage ? <p>{emailMessage}</p> : <></>}

                {passwordMessage ? <p>{passwordMessage}</p> : <></>}

                <div id="left">
                    <div>
                        Already have an account?
                    <button id="signupBtn" onClick={() => history.push('/login')}>SIGN IN</button>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default Register;