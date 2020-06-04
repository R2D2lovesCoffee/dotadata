const Client = require('./client');

module.exports = class Game {
    constructor(socket1, socket2) {
        this.socket1 = socket1;
        this.socket2 = socket2;
        this.noQuestions = Client.config.ranked.noQuestions;
        this.questions = [];
        this.currentQuestion = null;
    }

    end() {
        this.socket1.emit('gameFinished', { myAnswers: this.socket1.user.answers, opponentAnswers: this.socket2.user.answers, questions: this.questions, myScore: this.socket1.user.score, opponentScore: this.socket2.user.score });
        this.socket2.emit('gameFinished', { myAnswers: this.socket2.user.answers, opponentAnswers: this.socket1.user.answers, questions: this.questions, myScore: this.socket2.user.score, opponentScore: this.socket1.user.score });
        this.socket1.user.score = null;
        this.socket2.user.score = null;
        this.socket1.user.answers = null;
        this.socket2.user.answers = null;
        this.socket1.user.currenlyPlaying = null;
        this.socket2.user.currenlyPlaying = null;
    }

    emitToBoth(eventName, payload) {
        this.socket1.emit(eventName, payload);
        this.socket2.emit(eventName, payload);
    }

    bothAnswered() {
        return this.socket1.user.answered && this.socket2.user.answered;
    }

    bothReady() {
        return this.socket1.user.ready && this.socket2.user.ready;
    }
}