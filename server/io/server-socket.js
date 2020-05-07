const socketio = require('socket.io');
const { socketAuth } = require('../auth');
const Client = require('./client');
const { fork } = require('child_process');

module.exports = class ServerSocket {
    constructor(server) {
        this.io = socketio(server);
        this.clients = [];
        this.clients.findClient = socketID => this.clients.find(client => client.socketID === socketID)
    }

    start() {
        this.io.use(socketAuth).on('connection', socket => {
            this.clients.push(new Client(socket));

            socket.on('startSoloGame', () => {
                const client = this.clients.findClient(socket.id);

            })

            socket.on('question', () => {
                const client = this.clients.findClient(socket.id);
                const child = fork('./scripts/questions/type1.js');
                child.on('message', question => {
                    socket.emit('question', question);
                    child.kill();
                })
            })

            socket.on('disconnect', () => {
                const index = this.clients.map(client => client.socketID).indexOf(socket.id);
                this.clients.splice(index, 1);
            })
        })
    }
}