const app = require('./app');
const { PORT } = require('./config');
const socketio = require('socket.io');
const SocketManger = require('./socket-manager');

const connection = require('./database/connection');

// const fillDB = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })
connection.sync().then(() => {
    require('./database/associations')();
})

const httpServer = app.listen(PORT, console.log(`server started on port ${PORT}`));
const io = socketio(httpServer);
io.on('connection', socket => {
    new SocketManger(socket).start();
})