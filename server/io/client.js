module.exports = class Client {
    constructor(socket) {
        this.socket = socket;
        this.socketID = socket.id;
        this.userID = socket.decoded.user_id;
        this.score = null;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.currentlyPlaying = null;
        this.timeInterval = null;
        this.mmrGapIncreaseInterval = null;
        this.searchOpponentInterval = null;
        this.report = null;
        this.question = null;
        this.gap = null;
        this.finding = false;
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
            mmrGap: 30,
            mmrGapIncreaseIntervalTime: 7000,
            searchOpponentIntervalTime: 2000,
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
        this.gap = null;
        this.mmrGapIncreaseInterval = null;
        this.searchOpponentInterval = null;
        this.timeInterval = null;
    }

    clearIntervals() {
        clearInterval(this.timeInterval);
        clearInterval(this.mmrGapIncreaseInterval);
        clearInterval(this.searchOpponentInterval);
    }
}