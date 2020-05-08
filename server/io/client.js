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
    }
    static config = {
        soloGame: {
            noQuestions: 5,
            timePerQuestion: 5
        },
        rankedGame: {

        }
    };
    init(gameType) {
        this.currentlyPlaying = gameType;
        this.score = 0;
        this.currentQuestion = 1;
    }

    reset() {
        this.score = null;
        this.currentQuestion = null;
        this.correctAnswer = null;
        this.currentlyPlaying = null;
        this.interval = null;
    }
}