import React, { Component } from 'react';
import { state, useState, setState } from 'react';

export default function Profile() {

    const state = {
        selectedFile: null
    }

    const fileSelectedHandler = (event) => {
        setState({
            selectedFile: URL.createObjectURL(event.target.files[0])
        })
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>mmr: </p>
            <p>email: </p>
            <img src={state.file} alt="profile pic" />
            <br />
            <input type="file" onChange={fileSelectedHandler} />
        </div>
    )
}


