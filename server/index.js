const app = require('./app');
const ServerSocket = require('./io/server-socket.js');
const { PORT } = require('./config');

const connection = require('./database/connection');

const { fillDB, fillItems, fillItemComponents } = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })

connection.sync().then(async () => {
    require('./database/associations')();
    // await fillItems();
    //await fillItemComponents();
})

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}...`));
new ServerSocket(server).start();