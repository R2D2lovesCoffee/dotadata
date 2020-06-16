module.exports = class Client {
    constructor(user, socketID) {
        this.socketID = socketID;
        this.user_id = user.id;
        this.ranked_mmr = user.ranked_mmr;
        this.solo_mmr = user.solo_mmr;
        this.nickname = user.nickname;
        this.finding = false;
        this.timeInterval = null;
        this.findOpponentInterval = null;
        this.gapIncreaseInterval = null;
        this.currentQuestion = null;
        this.score = null;
        this.gap = 60;
        this.answers = null;
        this.opponent = null;
        this.currentlyPlaying = null;
        this.questions = null;
    };
    static config = {
        gapIncreaseTime: 4000,
        gapValueToIncrease: 60,
        findOpponentIntervalTime: 2000,
        ranked: {
            timePerQuestion: 10000,
            noQuestions: 5
        },
        solo: {
            timePerQuestion: 5000,
            noQuestions: 5
        }
    }

    initGame(type) {
        this.answers = [];
        this.score = 0;
        this.currentlyPlaying = type;
        if (type === 'solo') {
            this.questions = [];
        }
    }

    reset() {
        this.currentlyPlaying = null;
        this.questions = null;
        this.score = null;
        this.currentQuestion = null;
        this.gap = 60;
        this.timeInterval = null;
        this.findOpponentInterval = null;
        this.gapIncreaseInterval = null;
        clearInterval(this.timeInterval);
    }
}