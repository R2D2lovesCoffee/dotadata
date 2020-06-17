const socketio = require('socket.io');
const { socketAuth } = require('../auth');
const Client = require('./client');
const Game = require('./game');
const { fork } = require('child_process');
const User = require('../database/models/User');
const fs = require('fs');

module.exports = class ServerSocket {
    constructor(server) {
        this.index = 0;
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
        return 50 + (10 - time / 1000) * 10;
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

            socket.on('findOpponent', async () => {
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
                        clearInterval(user.findOpponentInterval);
                        clearInterval(opponent.findOpponentInterval);
                        user.initGame('ranked');
                        opponent.initGame('ranked');
                        socket.join(`game_${this.index}`);
                        this.io.sockets.connected[opponent.socketID].join(`game_${this.index}`);
                        const room = this.io.of(`game_${this.index}`);
                        this.index++;
                        room.game = new Game(socket, this.io.sockets.connected[opponent.socketID], room.name.split('/')[1]);
                        this.io.to(socket.id).emit('opponent', { id: opponent.user_id, nickname: opponent.nickname });
                        this.io.to(opponent.socketID).emit('opponent', { id: socket.user.user_id, nickname: socket.user.nickname });
                    }
                }, Client.config.findOpponentIntervalTime);
                socket.user.gapIncreaseInterval = setInterval(() => {
                    socket.user.gap += Client.config.gapValueToIncrease;
                }, Client.config.gapIncreaseTime);
            })

            socket.on('startRankedGame', async () => {
                socket.user.ready = true;
                const { game } = this.io.of(Object.keys(socket.rooms)[1]);
                if (game.socket1.user.ready && game.socket2.user.ready) {
                    const { question, correct } = await this.generateQuestion();
                    game.questions.push({ question, correct });
                    game.socket1.user.ready = false;
                    game.socket2.user.ready = false;
                    this.io.to(game.socket1.id).emit('question', question);
                    this.io.to(game.socket2.id).emit('question', question);
                    game.socket1.user.answered = false;
                    game.socket2.user.answered = false;
                    game.currentQuestion = 0;
                }
            })

            socket.on('startSoloGame', async () => {
                const { user } = socket;
                user.initGame('solo');
                const { question, correct } = await this.generateQuestion();
                user.questions.push({ question, correct });
                socket.emit('question', question);
                user.currentQuestion = 0;
            })

            socket.on('ready', async () => {
                if (socket.user.currentlyPlaying === 'ranked') {
                    const { game } = this.io.of(Object.keys(socket.rooms)[1]);
                    socket.user.ready = true;
                    if (game.bothReady()) {
                        game.socket1.user.answered = false;
                        game.socket2.user.answered = false;
                        game.socket1.user.ready = false;
                        game.socket2.user.ready = false;
                        game.socket1.user.time = game.socket2.user.time = new Date();
                        let time = Client.config.ranked.timePerQuestion / 1000;
                        game.emitToBoth('time', time--);
                        game.timeInterval = setInterval(() => {
                            if (!game.socket1.user.answered) {
                                this.io.to(game.socket1.id).emit('time', time);
                            }
                            if (!game.socket2.user.answered) {
                                this.io.to(game.socket2.id).emit('time', time);
                            }
                            if (time === 0) {
                                clearInterval(game.timeInterval);
                                if (!game.socket1.user.answers[game.currentQuestion]) {
                                    game.socket1.user.answers.push(null);
                                }
                                if (!game.socket2.user.answers[game.currentQuestion]) {
                                    game.socket2.user.answers.push(null);
                                }
                                if (game.currentQuestion + 1 !== game.noQuestions) {
                                    game.emitToBoth('question', game.questions[game.currentQuestion + 1].question);
                                    game.currentQuestion++;
                                } else {
                                    game.end();
                                }
                            }
                            time--;
                        }, 1000);
                        if (game.currentQuestion + 1 < game.noQuestions) {
                            const { question, correct } = await this.generateQuestion();
                            game.questions.push({ question, correct });
                        }
                    }
                } else if (socket.user.currentlyPlaying === 'solo') {
                    let time = Client.config.solo.timePerQuestion / 1000;
                    socket.user.time = new Date();
                    socket.user.timeInterval = setInterval(() => {
                        socket.emit('time', time);
                        if (time === 0) {
                            clearInterval(socket.user.timeInterval);
                            socket.user.answers.push(null);
                            if (socket.user.currentQuestion + 1 !== Client.config.solo.noQuestions) {
                                socket.emit('question', socket.user.questions[socket.user.currentQuestion + 1].question);
                                socket.user.currentQuestion++;
                            } else {
                                socket.emit('gameFinished', { questions: socket.user.questions, answers: socket.user.answers, score: socket.user.score });
                                socket.user.reset();
                            }
                        }
                        time--;
                    }, 1000);
                    if (socket.user.currentQuestion + 1 < Client.config.solo.noQuestions) {
                        const { question, correct } = await this.generateQuestion();
                        socket.user.questions.push({ question, correct })
                    }
                }
            })

            socket.on('answer', async index => {
                if (socket.user.currentlyPlaying === 'ranked') {
                    if (!socket.user.answered) {
                        const { game } = this.io.of(Object.keys(socket.rooms)[1]);
                        if (game.questions[game.currentQuestion]) {
                            socket.user.answers.push(index);
                            socket.user.answered = true;
                            const opponentSocket = game.socket1.id === socket.id ? game.socket2 : game.socket1;
                            // opponentSocket.emit('opponentAnswer', index);
                            if (index === game.questions[game.currentQuestion].correct) {
                                const time = new Date() - socket.user.time;
                                socket.user.score += this.calculateScore(time);
                                socket.emit('score', socket.user.score);
                                opponentSocket.emit('opponentScore', socket.user.score);
                            }
                            if (game.bothAnswered()) {
                                clearInterval(game.timeInterval);
                                if (game.currentQuestion + 1 !== game.noQuestions) {
                                    game.emitToBoth('question', game.questions[game.currentQuestion + 1].question);
                                    game.socket1.user.answered = false;
                                    game.socket2.user.answered = false;
                                    game.currentQuestion++;
                                } else {
                                    game.end();
                                }
                            }
                        }
                    }
                } else if (socket.user.currentlyPlaying === 'solo') {
                    if (socket.user.questions[socket.user.currentQuestion]) {
                        clearInterval(socket.user.timeInterval);
                        const time = new Date() - socket.user.time;
                        socket.user.answers.push(index);
                        if (index === socket.user.questions[socket.user.currentQuestion].correct) {
                            socket.user.score += this.calculateScore(time);
                            socket.emit('score', socket.user.score);
                        }
                        if (socket.user.currentQuestion + 1 !== Client.config.solo.noQuestions) {
                            socket.emit('question', socket.user.questions[socket.user.currentQuestion + 1].question);
                            socket.user.currentQuestion++;
                        } else {
                            socket.emit('gameFinished', { questions: socket.user.questions, answers: socket.user.answers, score: socket.user.score });
                            let noCorrect = 0;
                            for (let i = 0; i < socket.user.questions.length; i++) {
                                if (socket.user.questions[i].correct === socket.user.answers[i]) {
                                    noCorrect++;
                                }
                            }
                            socket.user.solo_mmr = parseInt(socket.user.solo_mmr + 25 / Client.config.solo.noQuestions * noCorrect)
                            socket.user.reset();
                            User.update({ solo_mmr: socket.user.solo_mmr }, { where: { id: socket.user.user_id } })
                        }
                    }
                }
            })

            socket.on('stopFinding', () => {
                const { user } = socket;
                user.finding = false;
                clearInterval(user.findOpponentInterval);
            })

            socket.on('disconnect', () => {
                const { user } = socket;
                user.finding = false;
                clearInterval(user.findOpponentInterval);
            })
        })
    }
}
