const Question = require('./Question');
const question = new Question(3);
process.send({ message: 'hello from type3' });