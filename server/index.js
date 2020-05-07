const app = require('./app');
const ServerSocket = require('./server-socket.js');
const { PORT } = require('./config');

const connection = require('./database/connection');

// const fillDB = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })
connection.sync().then(() => {
    require('./database/associations')();
})

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
const serverSocket = new ServerSocket(server);
serverSocket.start();