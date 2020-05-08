module.exports = function Client(socket) {
    this.socket = socket;
    this.socketID = socket.id;
    this.userID = socket.decoded.user_id;
    this.score = null;
    this.currentQuestion = null;
    this.correctAnswer = null;
    this.currentlyPlaying = null;
    this.interval = null;
}