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

    return (
        <div>
            <form>

                <input type="email" required placeholder="Email" onChange={handleEmailChange} />
                <input type="password" placeholder="Password" onChange={handlePasswordChange} />
                <input type="password" placeholder="Confirm passowrd" onChange={handleConfirmPasswordChange} />
                <input type="submit" value="Submit" onClick={register} />
                <p>{this.state.message}</p>
            </form>
        </div>
    )
}

const register = () => {
    if (this.password === this.confirmPassword) {
        http.post('/register', { email, password })
            .then(resp => {
                if (resp.access_token) {
                    localStorage.setItem('access_token', resp.access_token);
                }
            }).catch(error => {
                console.log(error);
                if (error.message) {
                    setMessage(error.message);
                }
            })
    }
}
