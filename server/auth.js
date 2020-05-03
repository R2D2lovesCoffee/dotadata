const jwt = require('jsonwebtoken');
const secret = require('./config');

module.exports = (req, res, next) => {
    const token = req.headers['authorization'].split('Bearer ')[1];
    const payload = jwt.decode(token);
    if (payload) {
        next();
    } else {
        res.status(401).send();
    }
}