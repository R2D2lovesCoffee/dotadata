import socketIOClient from "socket.io-client";
import config from './config';
const socket = process.env.NODE_ENV === 'production' ? socketIOClient(config.serverURL, { path: '/application-server/socket.io', transports: ['polling'], secure: true }) : socketIOClient(config.serverURL);
export default socket;