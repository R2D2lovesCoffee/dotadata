const Question = require('./Question');
const question = new Question(2);
process.send({ message: 'hello from type2' });