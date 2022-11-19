import Question from "./question.js";
import SimpleQuestion from "./simple-question.js";

export default class Questions {
    questions = [];
    key = null;
    constructor(key, questions = [], questionKeys = []) {
        this.key = key;
        for (let i = 0; i < questions.length; i++) {
            if (questions[i] instanceof Question) {
                this.questions.push(questions[i]);
            } else if (questions[i] instanceof SimpleQuestion) {
                this.questions.push(new Question(questions[i].question, questions[i].title, ""));
            } else {
                if (questionKeys[i] != null) {
                    this.questions.push(new Question(questions[i], questionKeys[i], ""));
                } else {
                    this.questions.push(new Question(questions[i], questions[i].title, ""));
                }
            }
        }
    }

    setKey(key) {
        this.key = key;
    }

    add(question) {
        if (question instanceof Question) {
            this.questions.push(question);
        } else if (question instanceof SimpleQuestion)  {
            this.questions.push(new Question(question.question, question.title, ""));
        } else {
            this.questions.push(new Question(question, "", ""));
        }
    }
}