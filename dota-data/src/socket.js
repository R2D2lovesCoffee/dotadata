import socketIOClient from "socket.io-client";
const socket = process.env.NODE_ENV === 'production' ? socketIOClient('wss://www.r2d2lovescoffee.com', { secure: true }) : socketIOClient('http://localhost:5000');
export default socket