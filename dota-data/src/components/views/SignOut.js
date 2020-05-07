import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import http from '../../http';

export default function SignOut() {
    return (
        localStorage.clear()
    )
}