import socketIOClient from "socket.io-client";
import config from './config';
const socket = socketIOClient(config.host);
export default socket;