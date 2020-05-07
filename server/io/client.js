module.exports = function Client(socket) {
    this.socket = socket;
    this.socketID = socket.id;
    this.userID = socket.decoded.user_id;
    this.soloGame = null;
    this.rankedGame = null;
}