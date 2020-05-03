const fs = require('fs');
const config = {};

let lines = [];
try {
    lines = fs.readFileSync('./.env', 'utf8').split('\n');
} catch (err) {
    console.log('The .env file doesn\'t exist. Please create the file according to example.env file.');
    console.log(err);
    process.exit();
}
lines.forEach(line => {
    const parts = line.split('=');
    config[parts[0]] = Number(parts[1]) ? Number(parts[1]) : parts[1];
    // config[parts[0]] = config[parts[0]].split('\\')[0];
})

const keys = Object.keys(config);

const allKeysSet = ['DBHOST', 'PORT', 'DBDIALECT', 'DBNAME', 'DBUSER', 'DBPASS'].every(key => keys.indexOf(key) >= 0);

if (!allKeysSet) {
    console.log('The .env file requires specific keys. You can find them in example.env file.');
    process.exit();
}
module.exports = config;
// cum ar zice wd. 'wait for it!'
// module.exports = {
//     DBHOST:'localhost',
//     PORT:5000,
//     DBDIALECT:'mysql',
//     DBNAME: 'dota_data',
//     DBUSER:'root',
//     DBPASS: 'baschetnba68'
// };
//stai asa sa iti fac user la proiect sa poti da push ah. ai cont de github? fa-ti repede unul. www.github.com inchide ochii cat timp fac sa nu mi furi datecu le.
//cu config.js sa nu dai push niciodata. 
//practic tot codul din fisierul asta e inutil la tine. dintr-un annume motiv. asa ca am scris obiectul ala de mana
//ciudat totusi..
// arata-mi baza de date
