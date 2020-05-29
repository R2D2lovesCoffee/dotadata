const socketio = require('socket.io');
const { socketAuth } = require('../auth');
const Client = require('./client');
const { fork } = require('child_process');
const User = require('../database/models/User');
const fs = require('fs');

module.exports = class ServerSocket {
    constructor(server) {
        this.io = socketio(server);
        this.clients = [];
        this.clients.findClient = socketID => this.clients.find(client => client.socketID === socketID);
        this.searchingClients = [];
        fs.readdir('./scripts/questions', (err, files) => {
            if (err) {
                console.log(err);
            } else {
                this.noTypes = files.length - 1; // substract 1 because Question.js is in that folder too
            }
        })
    }

    sendQuestion(client) {
        const random = Math.floor(Math.random() * 3) + 1;
        const child = fork(`./scripts/questions/type${random}`);
        child.on('message', ({ question, correct }) => {
            child.kill();
            client.question = question;
            client.correctAnswer = correct;
            client.time = new Date();
            client.socket.emit('question', question);
            client.socket.emit('score', client.score)
            client.currentQuestion++;
        });
        child.on('error', err => {
            console.log('ERROR WHEN RUNNING SCRIPT type' + random);
            console.log(err);
            child.kill();
        });
    }

    handleAnswer(client, index) {
        clearInterval(client.timeInterval);
        if (client.currentlyPlaying) {
            client.time = new Date() - client.time;
            if (index === client.correctAnswer) {
                client.score += this.calculateScore(client.time);
            }
            client.addToReport(index);
            if (client.currentQuestion <= Client.config[client.currentlyPlaying].noQuestions) {
                this.sendQuestion(client);
            } else {
                client.reset();
                client.socket.emit('testFinished', client.report);
            }
        }
    }

    calculateScore(time) {
        return 100;
    }

    handleReady(client) {
        let remainingTime = Client.config[client.currentlyPlaying].timePerQuestion;
        client.timeInterval = setInterval(() => {
            client.socket.emit('time', --remainingTime);
            if (remainingTime === 0) {
                client.addToReport(null);
                clearInterval(client.timeInterval);
                if (client.currentlyPlaying) {
                    client.time = 1000 * Client.config[client.currentlyPlaying].timePerQuestion;
                    if (client.currentQuestion <= Client.config[client.currentlyPlaying].noQuestions) {
                        this.sendQuestion(client);
                    } else {
                        client.reset();
                        client.socket.emit('testFinished', client.report);
                    }
                }
            }
        }, 1000);
    }

    searchOpponent(client) {
        User.findOne({ where: { id: client.userID }, raw: true })
            .then(user => {
                client.nickname = user.nickname;
                client.mmr = user.ranked_mmr;
                client.finding = true;
                client.gap = Client.config.rankedGame.mmrGap;
                client.mmrGapIncreaseInterval = setInterval(() => {
                    client.gap += Client.config.rankedGame.mmrGap;
                }, Client.config.rankedGame.mmrGapIncreaseIntervalTime);
                client.searchOpponentInterval = setInterval(() => {
                    const findingClients = this.clients.filter(elem => elem.finding);
                    const currentIndex = findingClients.findIndex(elem => elem.socketID === client.socketID);
                    const diffs = findingClients.map((client2, index2) => {
                        return currentIndex === index2 ? Infinity : Math.abs(client.mmr - client2.mmr)
                    })
                    const minDiff = Math.min(...diffs);
                    if (minDiff <= client.gap) {
                        const matchIndex = diffs.indexOf(minDiff);
                        client.finding = false;
                        findingClients[matchIndex].finding = false;
                        client.clearIntervals();
                        findingClients[matchIndex].clearIntervals();
                        findClients[matchIndex].opponent = client.socketID;
                        client.opponent = findClients[matchIndex].socketID;
                        this.io.to(client.socketID).emit('opponent', findingClients[matchIndex].nickname);
                        this.io.to(findingClients[matchIndex].socketID).emit('opponent', client.nickname);
                    }
                }, Client.config.rankedGame.searchOpponentIntervalTime);
            })
    }

    start() {
        this.io.use(socketAuth).on('connection', socket => {
            console.log('client connected! ' + socket.id);
            this.clients.push(new Client(socket));

            socket.on('findOpponent', () => {
                const client = this.clients.findClient(socket.id);
                this.searchOpponent(client);
            })

            socket.on('ready', () => {
                const client = this.clients.findClient(socket.id);
                this.handleReady(client);
            })

            socket.on('startRankedGame', () => {
                const client = this.clients.findClient(socket.id);
                if (client.currentlyPlaying === null) {
                    client.init('rankedGame');
                    this.sendQuestion(client);
                }
            })

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
                this.clients[index].clearIntervals();
                this.clients.splice(index, 1);
                const index2 = this.searchingClients.map(client => client.socketID).indexOf(socket.id);
                this.searchingClients.splice(index2, 1);
            })
        })
    }
}
