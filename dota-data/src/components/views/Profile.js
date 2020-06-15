import React, { useEffect } from 'react';
import { useState } from 'react';
import '../../App.css';
import http from '../../http';
import config from '../../config';
import './Home.css';
export default function Profile() {

    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [soloMmr, setSoloMmr] = useState(0);
    const [rankedMmr, setRankedMmr] = useState(0);
    const [file, setFile] = useState(null);
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        http.get('/profile')
            .then(data => {
                setEmail(data.email);
                setNickname(data.nickname);
                setSoloMmr(data.solo_mmr);
                setRankedMmr(data.ranked_mmr);
            })
    }, [])

    const handleNicknameChange = (event) => {
        setNickname(event.target.value);
    }

    const save = () => {
        const formData = new FormData();
        setEdit(false);
        formData.append('image', file);
        formData.append('nickname', nickname);
        http.post('/profile', formData)
            .then(resp => console.log(resp));
    }

    function ImageUpload(event) {
        setFile(event.target.files[0]);
        const img = document.querySelector('.pictureProfile');
        const inp = document.querySelectorAll('input')[1];
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    img.setAttribute('src', reader.result);
                })
                reader.readAsDataURL(file);
                img.style.display = 'block';
            } else {
                img.setAttribute('src', null);
                img.style.display = 'none';
                inp.value = '';
            }
        }
    }
    return (
        <div className="container" id="special">
            <h1 id='special'>Profile</h1>
            <p>Solo Rating: {soloMmr}</p>
            <p>Multiplayer Rating: {rankedMmr}</p>
            {
                edit === false ? <div>
                    <p>Nickname:
                    <span> {nickname}</span>
                        <button onClick={() => setEdit(true)} className="buttonDesign" id='editBtn'>Edit</button>
                    </p>
                </div> :
                    <div>
                        <input value={nickname} onChange={handleNicknameChange} />
                    </div>
            }
            <p>Email: {email}</p>
            <br />
            <p>Enter a profile pic: </p>
            <div className="input-group mb-3">
                <div className="custom-file">
                    <input type="file" onChange={ImageUpload} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                    <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
                </div>
            </div>
            <br />
            <button onClick={save} className="buttonDesign" id="saveBtn" >Save</button>
            <img src={`${config.serverURL}/profile_pics/avatar_${localStorage.getItem('user_id')}.png`} alt='' />
        </div>
    )
}

