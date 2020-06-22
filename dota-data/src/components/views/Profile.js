import React, { useEffect } from 'react';
import { useState } from 'react';
import '../../App.css';
import http from '../../http';
import './Home.css';

export default function Profile() {
    let file = {};
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [soloMmr, setSoloMmr] = useState(0);
    const [rankedMmr, setRankedMmr] = useState(0);
    const [edit, setEdit] = useState(false);
    const [imageSrc, setImageSrc] = useState('');
    const [message, setMessage] = useState('');
    // const [messageTimeout, setMessageTimeout] = useState(null);

    useEffect(() => {
        http.loadImage(localStorage.getItem('user_id')).then(src => {
            setImageSrc(src);
        });
        http.get('/profile')
            .then(data => {
                setEmail(data.email);
                setNickname(data.nickname);
                setSoloMmr(data.solo_mmr);
                setRankedMmr(data.ranked_mmr);
            })
        // return () => {
        //     clearTimeout(messageTimeout);
        // }
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
            .then(() => {
                setMessage('Updated successfully!');
                // setMessageTimeout(setTimeout(() => {
                //     setMessage('');
                // }, 3000));
                http.loadImage(localStorage.getItem('user_id')).then(src => setImageSrc(src));
            });
        // without reloading the page the data in the DB is not going to reload, so we will render the same opponent nickname even tho he changes it and wants to play ranked after the update. So with this line we dinamically respond with the updated opponent nickname.
        window.location.reload(true);
    }

    function ImageUpload(event) {
        file = event.target.files[0];
        const img = document.querySelector('img');
        if (file) {
            if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    img.setAttribute('src', reader.result);
                })
                reader.readAsDataURL(file);
            }
        }
    }
    return (
        <div className="container" id="special">
            <h1 id="special">Profile</h1>
            <p>Solo Rating: {soloMmr}</p>
            <p>Multiplayer Rating: {rankedMmr}</p>
            {
                edit === false ? <div>
                    <p>Nickname:
                    <span> {nickname}</span>
                        <button onClick={() => setEdit(true)} className="buttonDesign" id="editBtn">Edit</button>
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
            <div>
                <img className='pictureProfile' src={imageSrc} alt='' />
            </div>
            <br />
            <button onClick={save} className="buttonDesign" id="saveBtn" type="submit" >
                Save
            </button>
            <p>{message}</p>
        </div>
    )
}

