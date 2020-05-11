module.exports = function () {
    this.text = null;
    this.answers = null;
    this.subject = null;
    this.meta = null;
    this.setAnswers = (answers) => this.answers = answers;
    this.setText = (text) => this.text = text;
    this.setSubject = (subject) => this.subject = subject;
}
