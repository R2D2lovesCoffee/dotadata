const socketio = require('socket.io');
const { socketAuth } = require('../auth');
const Client = require('./client');
const { fork } = require('child_process');
const User = require('../database/models/User');
const fs = require('fs');

module.exports = class ServerSocket {
    constructor(server) {
        this.io = socketio(server);
        fs.readdir('./scripts/questions', (err, files) => {
            if (err) {
                console.log(err);
            } else {
                this.noTypes = files.length - 1; // substract 1 because Question.js is in that folder too
            }
        })
    }

    calculateScore(time) {
        return 100;
    }

    generateQuestion() {
        return new Promise((resolve, reject) => {
            const random = Math.floor(Math.random() * 3) + 1;
            const child = fork(`./scripts/questions/type${random}`);
            child.on('message', ({ question, correct }) => {
                child.kill();
                resolve({ question, correct });
            });
            child.on('error', err => {
                console.log('ERROR WHEN RUNNING SCRIPT type' + random);
                console.log(err);
                child.kill();
            });
        })
    }

    start() {
        this.io.use(socketAuth).on('connection', socket => {
            User.findOne({ attributes: ['id', 'ranked_mmr', 'solo_mmr', 'nickname'], raw: true, where: { id: socket.decoded.user_id } })
                .then(user => {
                    socket.user = new Client(user, socket.id);
                });
            socket.on('findOpponent', () => {
                const { user } = socket;
                user.finding = true;
                user.findOpponentInterval = setInterval(() => {
                    const findingUsers = Object.keys(this.io.sockets.connected).map(socketID => this.io.sockets.connected[socketID].user)
                        .filter(user => user.finding);
                    const currentIndex = findingUsers.findIndex(elem => elem.socketID === user.socketID);
                    const diffs = findingUsers.map((user2, index2) => {
                        return currentIndex === index2 ? Infinity : Math.abs(user.ranked_mmr - user2.ranked_mmr)
                    })
                    const minDiff = Math.min(...diffs);
                    if (minDiff <= user.gap) {
                        const opponent = findingUsers[diffs.indexOf(minDiff)]
                        user.finding = false;
                        opponent.finding = false;
                        user.opponent = opponent.socketID;
                        opponent.opponent = user.socketID;
                        clearInterval(user.findOpponentInterval);
                        clearInterval(opponent.findOpponentInterval);
                        user.initGame('ranked');
                        opponent.initGame('ranked');
                        this.io.to(socket.id).emit('opponent', opponent.nickname);
                        this.io.to(opponent.socketID).emit('opponent', socket.user.nickname);
                    }
                }, Client.config.findOpponentIntervalTime);

                socket.user.gapIncreaseInterval = setInterval(() => {
                    socket.user.gap += Client.config.gapValueToIncrease;
                }, Client.config.gapIncreaseTime);
            })

            socket.on('startRankedGame', async () => {
                socket.user.ready = true;
                const opponentSocket = this.io.sockets.connected[socket.user.opponent];
                if (opponentSocket.user.ready) {
                    const { question, correct } = await this.generateQuestion();
                    socket.user.questions.push({ question, correct });
                    opponentSocket.user.questions.push({ question, correct });
                    socket.user.ready = false;
                    opponentSocket.user.ready = false;
                    this.io.to(socket.id).emit('question', question);
                    this.io.to(opponentSocket.id).emit('question', question);
                    socket.user.currentQuestion = 0;
                    opponentSocket.user.currentQuestion = 0;
                    const next = await this.generateQuestion();
                    socket.user.questions.push(next);
                    opponentSocket.user.questions.push(next);
                }
            })

            socket.on('ready', async () => {
                const { user } = socket;
                let remainingTime = Client.config.timePerQuestion / 1000;
                user.timeInterval = setInterval(() => {
                    this.io.to(user.socketID).emit('time', --remainingTime);
                    if (remainingTime === 0) {
                        clearInterval(user.timeInterval);
                        user.questions[user.currentQuestion].given = null;
                        if (user.currentQuestion + 1 !== user.noQuestions) {
                            this.io.to(user.socketID).emit('question', user.questions[user.currentQuestion + 1].question);
                            user.currentQuestion++;
                        } else {
                            this.io.to(user.socketID).emit('gameFinished', user.questions);
                            user.reset();
                        }
                    }
                }, 1000);
                if (user.currentQuestion + 1 < user.noQuestions) {
                    if (!user.opponent) {
                        const { question, correct } = await this.generateQuestion();
                        user.questions.push({ question, correct });
                    } else {
                        if (user.currentQuestion + 1 === user.questions.length) {
                            const { question, correct } = await this.generateQuestion();
                            const opponentSocket = this.io.sockets.connected[user.opponent];
                            user.questions.push({ question, correct });
                            opponentSocket.user.questions.push({ question, correct });
                        }
                    }
                }
            })

            socket.on('answer', async index => {
                const { user } = socket;
                clearInterval(user.timeInterval);
                user.questions[user.currentQuestion].given = index;
                if (index === user.questions[user.currentQuestion].correct) {
                    user.score += this.calculateScore();
                }
                if (user.currentQuestion + 1 !== user.noQuestions) {
                    this.io.to(user.socketID).emit('question', user.questions[user.currentQuestion + 1].question);
                    user.currentQuestion++;
                } else {
                    this.io.to(user.socketID).emit('gameFinished', user.questions);
                    user.reset();
                }
            })

            // socket.on('disconnect', () => {
            //     const index = this.clients.map(client => client.socketID).indexOf(socket.id);
            //     this.clients[index].clearIntervals();
            //     this.clients.splice(index, 1);
            //     const index2 = this.searchingClients.map(client => client.socketID).indexOf(socket.id);
            //     this.searchingClients.splice(index2, 1);
            // })
        })
    }
}
