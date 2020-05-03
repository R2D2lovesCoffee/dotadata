import React, { usestate, useState } from 'react';
import http from 'http'

function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    return (
        <div>
            <form>

                <input type="email" required placeholder />
                <input />
                <input />

            </form>
        </div>
    )
}