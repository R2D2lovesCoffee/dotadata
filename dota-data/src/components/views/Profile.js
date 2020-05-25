import React, { useImperativeHandle } from 'react';
import { state, useState } from 'react';
import '../../App.css';
import http from '../../http';

export default function Profile() {

    const [nickname, setNickname] = useState('');

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    }

    const sendToDB = () => {
        http.post('/profile', { nickname })
            .then(resp => {
                console.log('succes');
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>solo rating: </p>
            <p>multiplayer rating: </p>
            <p>Nickname: </p>
            <input value={nickname} onChange={handleNicknameChange} placeholder="nickname" />
            <button onClick={sendToDB}>Save</button>
            <p>email: </p>

            <br />
            <input type='file' onChange={ImageUpload} />
            <p>post a picture: </p>
            <img className="pictureProfile" src='' alt='user-image' />
            <p></p>
        </div>
    )
}

function ImageUpload(event) {
    const file = event.target.files[0];
    const img = document.querySelector('.pictureProfile');
    const p = document.querySelectorAll('p')[4];
    const pSituation = document.querySelectorAll('p')[5];
    const inp = document.querySelectorAll('input')[1];
    if (file) {
        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                img.setAttribute('src', reader.result);
            })
            reader.readAsDataURL(file);
            pSituation.textContent = '';
            img.style.display = 'block';
        } else {
            img.setAttribute('src', null);
            img.style.display = 'none';
            inp.value = '';
            pSituation.textContent = "not working, try posting a picture";
        }
    }
}
