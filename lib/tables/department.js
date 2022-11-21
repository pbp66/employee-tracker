export default class Department {  
    constructor(name, id = null) {
        this.name = name;
        this.id = id;
        this.manager = null;
    }
}