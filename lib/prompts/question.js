import SimpleQuestion from './simple-question.js';

export default class Question extends SimpleQuestion {
    // Private Class Attributes
    #default;
    #validate;
    #filter;
    #transformer;
    #when;
    #pageSize;
    #prefix;
    #suffix;
    #askAnswered;
    #loop;
    
    // Constructor
    constructor(question, title, answerType = "input", defaultAnswer = "", choices = []) {
        super(question, title);
        if (answerType === "") {
            this.type = "input";
        } else {
            this.type = answerType; //editor launches a text editor. For basic input, use input      
        }

        this.name = this.title;
        this.message = this.question;

        // If no answer is provided by the user, use default
        this.setDefault(defaultAnswer);

        if (choices != null && choices.length > 0) {
            this.choices = choices;
            this.#pageSize = choices.length; // used with list, rawList, expand, or checkbox
        }

        if (answerType === "editor") {
            this.waitUserInput = true;
        }
    }

    setDefault(answer) {
        this.#default = () => {
            return answer;
        }
    }

    getDefault() {
        return this.#default;
    }

    getValidator() {
        return this.#validate;
    }
    
    setValidator(validator) {
        this.#validate = () => {
            return validator;
        }
    }
    
    getFilter() {
        return this.#filter;
    }
    
    setFilter(filter) {
        this.#filter = () => {
            return filter;
        }
    }
    
    getTransformer() {
        return this.#transformer;
    }
    
    setTransformer(transformer) {
        this.#transformer = () => {
            return transformer;
        }
    }
    
    getWhen() {
        return this.#when;
    }
    
    setWhen(when) {
        this.#when = when;
    }
    
    getPageSize() {
        return this.#pageSize;
    }
    
    setPageSize(pageSize) {
        this.#pageSize = pageSize;
    }
    
    getPrefix() {
        return this.#prefix;
    }
    
    setPrefix(prefix) {
        this.#prefix = prefix;
    }
    
    getSuffix() {
        return this.#suffix;
    }
    
    setSuffix(suffix) {
        this.#suffix = suffix;
    }
    
    getAskAnswered() {
        return this.#askAnswered;
    }
    
    setAskAnswered(askAnswered) {
        this.#askAnswered = askAnswered;
    }
    
    getLoop() {
        return this.#loop;
    }

    setLoop(loop) {
        this.#loop = loop;
    }
}