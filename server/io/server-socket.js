const socketio = require('socket.io');
const { socketAuth } = require('../auth');
const Client = require('./client');
const { fork } = require('child_process');
const fs = require('fs');

module.exports = class ServerSocket {
    constructor(server) {
        this.io = socketio(server);
        this.clients = [];
        this.clients.findClient = socketID => this.clients.find(client => client.socketID === socketID);
        fs.readdir('./scripts/questions', (err, files) => {
            if (err) {
                console.log(err);
            } else {
                this.noTypes = files.length - 1; // substract 1 because Question.js is in that folder too
            }
        })
    }

    sendQuestion(client) {
        const random = 1;
        const child = fork(`./scripts/questions/type${random}`);
        let remainingTime = Client.config[client.currentlyPlaying].timePerQuestion;
        child.on('message', ({ question, correct }) => {
            child.kill();
            client.correctAnswer = correct;
            client.time = new Date();
            client.socket.emit('question', { question, time: remainingTime, score: client.score });
            client.currentQuestion++;
            client.interval = setInterval(() => {
                client.socket.emit('time', --remainingTime);
                if (remainingTime === 0) {
                    clearInterval(client.interval);
                    if (client.currentlyPlaying) {
                        client.time = 1000 * Client.config[client.currentlyPlaying].timePerQuestion;
                        if (client.currentQuestion <= Client.config[client.currentlyPlaying].noQuestions) {
                            this.sendQuestion(client);
                        } else {
                            client.reset();
                            client.socket.emit('testFinished');
                        }
                    }
                }
            }, 1000);
        });
        child.on('error', err => {
            console.log('ERROR WHEN RUNNING SCRIPT type' + random);
            console.log(err);
            child.kill();
        });
    }

    handleAnswer(client, index) {
        console.log(client.currentlyPlaying);
        if (client.currentlyPlaying) {
            if (client.currentQuestion <= Client.config[client.currentlyPlaying].noQuestions) {
                // client.currentQuestion++;
                clearInterval(client.interval);
                client.time = new Date() - client.time;
                if (index === client.correctAnswer) {
                    client.score += this.calculateScore(client.time);
                }
                this.sendQuestion(client);
            } else {
                client.reset();
                client.socket.emit('testFinished');
            }
        }
    }

    calculateScore(time) {
        return 100;
    }

    start() {
        this.io.use(socketAuth).on('connection', socket => {
            console.log('client connected! ' + socket.id);
            this.clients.push(new Client(socket));

            socket.on('startSoloGame', () => {
                const client = this.clients.findClient(socket.id);
                if (client.currentlyPlaying === null) {
                    client.init('soloGame');
                    this.sendQuestion(client);
                }
            })

            socket.on('answer', index => {
                const client = this.clients.findClient(socket.id);
                this.handleAnswer(client, index);
            })

            socket.on('disconnect', () => {
                const index = this.clients.map(client => client.socketID).indexOf(socket.id);
                clearInterval(this.clients[index].interval);
                this.clients.splice(index, 1);
            })
        })
    }
}