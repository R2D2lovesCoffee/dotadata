module.exports = class Client {
    constructor(user, socketID) {
        this.socketID = socketID;
        this.user_id = user.id;
        this.ranked_mmr = user.ranked_mmr;
        this.solo_mmr = user.ranked_mmr;
        this.nickname = user.nickname;
        this.finding = false;
        this.timeInterval = null;
        this.findOpponentInterval = null;
        this.gapIncreaseInterval = null;
        this.currentQuestion = null;
        this.score = null;
        this.gap = 30;
        this.questions = null;
        this.opponent = null;
        this.currentlyPlaying = null;
    };
    static config = {
        gapIncreaseTime: 4000,
        gapValueToIncrease: 30,
        findOpponentIntervalTime: 2000,
        timePerQuestion: 5000,
    }

    initGame(type) {
        this.questions = [];
        this.score = 0;
        this.currentlyPlaying = type;
        switch (type) {
            case 'ranked':
                this.noQuestions = 10;
                break;
            case 'solo':

            default:
                throw new Error('bad \'type\' parameter for init method');
        }
    }

    reset() {
        this.currentlyPlaying = null;
        this.questions = null;
        this.score = null;
        this.currentQuestion = null;
        this.gap = 30;
        this.timeInterval = null;
        this.findOpponentInterval = null;
        this.gapIncreaseInterval = null;
    }

    // static config = {
    //     soloGame: {
    //         noQuestions: 10,
    //         timePerQuestion: 10
    //     },
    //     rankedGame: {
    //         mmrGap: 30,
    //         mmrGapIncreaseIntervalTime: 7000,
    //         searchOpponentIntervalTime: 2000,
    //     }
    // };
    // init(gameType) {
    //     this.currentlyPlaying = gameType;
    //     this.score = 0;
    //     this.currentQuestion = 1;
    //     this.report = {
    //         score: 0,
    //         questions: []
    //     };
    // }

    // reset() {
    //     this.score = null;
    //     this.currentQuestion = null;
    //     this.correctAnswer = null;
    //     this.currentlyPlaying = null;
    //     this.question = null;
    //     this.gap = null;
    //     this.mmrGapIncreaseInterval = null;
    //     this.searchOpponentInterval = null;
    //     this.timeInterval = null;
    // }

    // clearIntervals() {
    //     clearInterval(this.timeInterval);
    //     clearInterval(this.mmrGapIncreaseInterval);
    //     clearInterval(this.searchOpponentInterval);
    // }
}