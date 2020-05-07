const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

module.exports = {
    httpAuth: (req, res, next) => {
        const authorization = req.headers['authorization'];
        if (authorization) {
            const token = authorization.split('Bearer ')[1];
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).send();
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.status(401).send();
        }
    },
    socketAuth: (socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, SECRET, (err, decoded) => {
                if (err) {
                    return next(new Error('Socket Authentication error'));
                }
                socket.decoded = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    }
}