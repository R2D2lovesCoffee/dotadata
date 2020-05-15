module.exports = class Client {
    constructor(socket) {
        this.socket = socket;
        this.socketID = socket.id;
        this.userID = socket.decoded.user_id;
        this.score = null;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.currentlyPlaying = null;
        this.interval = null;
        this.report = null;
        this.question = null;
        this.addToReport = (givenAnswerIndex) => {
            this.report.score = this.score;
            this.report.questions.push({ question: this.question, correctAnswer: this.correctAnswer, givenAnswer: givenAnswerIndex, time: this.time })
        }
    }
    static config = {
        soloGame: {
            noQuestions: 10,
            timePerQuestion: 10
        },
        rankedGame: {

        }
    };
    init(gameType) {
        this.currentlyPlaying = gameType;
        this.score = 0;
        this.currentQuestion = 1;
        this.report = {
            score: 0,
            questions: []
        };
    }

    reset() {
        this.score = null;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.currentlyPlaying = null;
        this.question = null;
        this.interval = null;
    }
}