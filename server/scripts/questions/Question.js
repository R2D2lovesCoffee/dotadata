module.exports = function (type) {
    this.text = null;
    this.type = type;
    this.answers = null;
    this.correctAnswer = null;
    this.subject = null;
    this.meta = null;
    this.setAnswers = (answers) => this.answers = answers;
    this.setText = (text) => this.text = text;
    this.setCorrectAnswer = correct => this.correctAnswer = correct;
    this.setSubject = (subject) => this.subject = subject;
}
