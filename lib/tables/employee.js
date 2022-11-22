export default class Employee {
    #firstName;
    #lastName;
    
    constructor(name, role, manager, id = null) {
        this.name = name;
        if (name != null) {
            const names = name.split(" ");
            this.#firstName = names[0];
            this.#lastName = names[1];
        } else {
            this.#firstName = null;
            this.#lastName = null;
        }
        this.role = role;
        this.manager = manager;
        this.id = id;
    }

    getFullName() {
        return this.name;
    }

    setFullName(name) {
        const names = name.split(" ");
        this.setFirstName(names[0]);
        this.setLastName(names[1]);
    }

    getFirstName() {
        return this.#firstName;
        }
        
    setFirstName(name) {
        this.#firstName = name;
        this.#updateName();
    }

    getLastName() {
        return this.#lastName;
    }

    setLastName(name) {
        this.#lastName = name;
        this.#updateName();
    }

    #updateName() {
        this.name = this.#firstName + " " + this.#lastName;
    }
}