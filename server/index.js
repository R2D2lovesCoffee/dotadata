const app = require('./app');
const socketio = require('socket.io');
const { PORT } = require('./config');
const { fork } = require('child_process');

const connection = require('./database/connection');

// const fillDB = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })
connection.sync().then(() => {
    require('./database/associations')();
})

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
const clients = [];
const io = socketio(server);

io.on('connection', socket => {
    console.log(socket.id + ' connected');
    socket.on('test', data => {
        console.log(data);
    })
    socket.on('disconnect', () => {
        console.log(socket.id + ' disconnected');
    })
})