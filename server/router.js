const router = require('express').Router();
const User = require('./database/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        User.findOne({ where: { email }, raw: true })
            .then(user => {
                if (user) {
                    bcrypt.compare(password, user.password_hash)
                        .then(result => {
                            if (result) {
                                const token = jwt.sign({ user_id: user.id }, SECRET);
                                res.send({ access_token: token });
                            } else {
                                res.status(400).send({ message: 'Email or password is incorrect!' });
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send({ message: 'Something went wrong. Please try again later.' });
                        })
                } else {
                    res.status(400).send({ message: 'Email or password is incorrect!' });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).send({ message: 'Something went wrong. Please try again later.' });
            })
    } else {
        res.status(400).send({ message: 'Wrong body format!' });
    }
})

router.post('/register', async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).send();
        } else {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            await User.create({ email, password_hash });
            res.send();
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();

    }

})

module.exports = router;