import socketIOClient from "socket.io-client";
export let socket = null;
export function connect() {
    socket = process.env.NODE_ENV === 'production' ? socketIOClient('wss://www.r2d2lovescoffee.com', { secure: true, query: { token: localStorage.getItem('access_token') } }) : socketIOClient('http://localhost:5000', {
        query: { token: localStorage.getItem('access_token') }
    });
};