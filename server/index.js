const app = require('./app');
const { PORT } = require('./config');

const connection = require('./database/connection');
// const Hero = require('./database/models/Hero');
// const Spell = require('./database/models/Spell');
// const HeroDetail = require('./database/models/HeroDetail');
// const SpellSound = require('./database/models/SpellSound');

// const fillDB = require('./scripts/fillDb');
// connection.sync({ force: true }).then(() => {
//     fillDB();
// })
connection.sync().then(() => {
    require('./database/associations')();
})
app.listen(PORT, console.log(`server started on port ${PORT}`));