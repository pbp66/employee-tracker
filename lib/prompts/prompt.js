import inquirer from "inquirer";

export default class Prompt {
    constructor(question) {
        this.questions = question.question;
        this.key = question.key;
        this.prompt = inquirer.createPromptModule();
    }

    async ask() {
        return await this.#prompt()
            .catch((err) => console.log(err));
    }

    async #prompt() {
        const response = await this.prompt(this.question);
        return response;
    }
}

