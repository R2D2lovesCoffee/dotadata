module.exports = class SocketManager {
    constructor(socket) {
        this.socket = socket;
    }

    start() {
        this.socket.on('test', data => {
            console.log('test:', data);
        })

        this.socket.on('test2', data => {
            console.log('test2:', data)
        })
    }
}