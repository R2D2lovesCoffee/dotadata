import React, { useState } from 'react';
import { useHistory } from "react-router-dom";

function Login() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    return (
        <div>
            <div>
                <input value={email} onChange={handleEmailChange} placeholder="email" />
            </div>
            <div>
                <input value={password} onChange={handlePasswordChange} placeholder="password" type="password" />
            </div>
            <button onClick={() => localStorage.setItem('access_token', '1')}>login</button>
            <button onClick={() => localStorage.removeItem('access_token')}>logout</button>
            <button onClick={() => history.push('/home')}>go home</button>
        </div>
    )
}

export default Login;