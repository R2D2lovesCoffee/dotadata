const app = require('./app');
const { PORT } = require('./config');

const connection = require('./database/connection');
const Hero = require('./database/models/hero');
const Spell = require('./database/models/spell');
connection.sync().then(() => {
    require('./database/associations')();
    // Hero.findAll({ include: [{ model: Spell, as: 'spells' }] })
    //     .then(resp => console.log(resp));
})

app.listen(PORT, console.log(`server started on port ${PORT}`));