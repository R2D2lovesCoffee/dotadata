import React from 'react';
import { Redirect } from 'react-router-dom';

export default function Protected(props) {
    const { Component, ...rest } = props;
    if (localStorage.getItem('access_token')) {
        return <Component {...rest} />
    } else {
        return <Redirect to="/login" />
    }
}
