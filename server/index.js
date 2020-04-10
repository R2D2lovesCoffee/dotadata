const app = require('./app');
const { PORT } = require('./config');

const connection = require('./database/connection');
connection.authenticate();


app.listen(PORT, console.log(`server started on port ${PORT}`));