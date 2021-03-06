const fs = require('fs');
const config = {};

let lines = [];
try {
    //lines = fs.readFileSync('D:/Codeala/Dota_Project/dotadata/server/.env', 'utf8').replace(/\r/g, '').split('\n');
    lines = fs.readFileSync(require('path').join(__dirname, './.env'), 'utf8').replace(/\r/g, '').split('\n');
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

const allKeysSet = ['DBHOST', 'PORT', 'DBDIALECT', 'DBNAME', 'DBUSER', 'DBPASS', 'SECRET'].every(key => keys.indexOf(key) >= 0);
if (!allKeysSet) {
    console.log('The .env file requires specific keys. You can find them in example.env file.');
    process.exit();
}
const hostIndex = process.argv.findIndex(elem => elem.split('=')[0] === 'host');
if (hostIndex >= 0) {
    config.HOST = process.argv[hostIndex].split('=')[1];
}
module.exports = config;
