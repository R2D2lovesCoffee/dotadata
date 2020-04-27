const app = require('./app');
const { PORT } = require('./config');

const connection = require('./database/connection');

// const fillDB = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })
connection.sync().then(() => {
    require('./database/associations')();
})
app.listen(5000, console.log(`server started on port ${PORT}`));