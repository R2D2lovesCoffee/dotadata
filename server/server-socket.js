const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const { socketAuth } = require('./auth');

module.exports = class ServerSocket {
    constructor(server) {
        this.io = socketio(server);
    }

    start() {
        this.io.use(socketAuth).on('connection', socket => {
            console.log('connected', socket.decoded);

            socket.on('disconnect', () => {
                console.log('disconnected');
            })
        })
    }
}