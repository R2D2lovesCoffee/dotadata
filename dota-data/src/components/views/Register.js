import React, { usestate, useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';

function Register() {

    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

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
        if (password === confirmPassword) {
            http.post('/register', { email, password })
                .then(resp => {
                    history.push('/login');
                }).catch(error => {
                    console.log(error);
                    if (error.message) {
                        setMessage(error.message);
                    }
                })
        }
    }

    return (
        <div>
            <div>
                <input value={email} required placeholder="Email" onChange={handleEmailChange} />
                <input value={password} type="password" placeholder="Password" onChange={handlePasswordChange} />
                <input value={confirmPassword} type="password" placeholder="Confirm passowrd" onChange={handleConfirmPasswordChange} />
                <button onClick={register} >REGISTER</button>
                <p>{message}</p>
            </div>
        </div>
    )
}



export default Register;