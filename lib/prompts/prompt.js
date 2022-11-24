import inquirer from "inquirer";

export default class Prompt {
    constructor(question) {
        if (!(question instanceof Array)) {
            this.question = [question];
        } else {
            this.question = question;
        }
        this.key = question.title;
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

