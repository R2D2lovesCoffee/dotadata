const router = require('express').Router();
const User = require('./database/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET, HOST } = require('./config');
const nodemailer = require('nodemailer');
const auth = require('./auth');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'r2d2lovescoffee@gmail.com',
        pass: JSON.parse(fs.readFileSync('./mailPass.json')).pass
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
                                    res.send({ access_token: token, user_id: user.id });
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
            res.status(409).send({ message: 'User already exists.' });
        } else {
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            const user = await User.create({ email, password_hash });
            const crypto = require('crypto').randomBytes(20).toString('hex');
            const verification_token = `${crypto}${user.dataValues.id}`
            await user.update({ active: false, verification_token, solo_mmr: 0, ranked_mmr: 0, nickname: `player_${user.id}` });
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

router.post('/profile', auth.httpAuth, async (req, res) => {
    const { nickname } = req.body
    const { user_id } = req.decoded;
    User.update({ nickname }, { where: { id: user_id } })
        .then(() => {
            if (req.files) {
                const { image } = req.files;
                const type = image.mimetype.split('/');
                if (type[0] === 'image') {
                    image.mv(`./database/profile_pics/avatar_${user_id}.png`, err => {
                        if (err) {
                            console.log(err);
                            res.status(500).send();
                        } else {
                            res.send();
                        }
                    });
                }
            } else {
                res.send();
            }
        }).catch(err => {
            console.log(err);
            res.status(500).send();
        })
})

router.get('/picture/:user_id', auth.httpAuth, (req, res) => {
    const { user_id } = req.params;
    fs.access(path.join(__dirname, `./database/profile_pics/avatar_${user_id}.png`), (err) => {
        if (!err) {
            res.sendFile(path.join(__dirname, `./database/profile_pics/avatar_${user_id}.png`));
        } else {
            res.sendFile(path.join(__dirname, './database/profile_pics/default.png'));
        }
    })
})

router.get('/profile', auth.httpAuth, async (req, res) => {
    const { user_id } = req.decoded;
    User.findOne({ raw: true, attributes: ['email', 'nickname', 'solo_mmr', 'ranked_mmr'], where: { id: user_id } }).then(user => {
        res.send(user);
    }).catch(err => {
        console.log(err);
        res.status(500).send();
    })
})

// GET NICKNAME
router.get('/ranked-game', auth.httpAuth, async (req, res) => {
    const { user_id } = req.decoded;
    User.findOne({ raw: true, attributes: ['nickname'], where: { id: user_id } }).then(nickname => {
        res.send(nickname)
    })
})

module.exports = router;