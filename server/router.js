const router = require('express').Router();
const User = require('./database/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET, HOST } = require('./config');
const nodemailer = require('nodemailer');

console.log(HOST);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'r2d2lovescoffee@gmail.com',
        pass: 'ogreshouldntbeinthero'
    }
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        User.findOne({ where: { email }, raw: true })
            .then(user => {
                if (user) {
                    if (user.active) {
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
                        res.status(400).send({ message: 'Please verify your email address!' });
                    }
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

            const user = await User.create({ email, password_hash });
            const crypto = require('crypto').randomBytes(20).toString('hex');
            const verification_token = `${crypto}${user.dataValues.id}`
            await user.update({ active: false, verification_token });
            const link = `${HOST}/api/verification-token?token=${verification_token}`;
            const mailOptions = {
                from: 'r2d2lovescoffee@gmail.com',
                to: email,
                subject: 'Hi there!',
                text: `Please click on the following ${link} link to verify your account. 
                If you did not request this, please ignore this email.`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            res.send();
        }
    } catch (error) {
        console.log('eroare jos:', error);
        res.status(500).send();
    }
})

router.get('/verification-token', async (req, res) => {
    const { token } = req.query;
    const user = await User.findOne({ where: { verification_token: token } });
    await user.update({ active: true });
    res.redirect(`${HOST}/login`);
})

module.exports = router;