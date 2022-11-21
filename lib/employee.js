import Role from "./role.js";

export default class Employee {
    #firstName;
    #lastName;
    
    constructor(name, role, manager) {
        this.name = name;
        if (name != null) {
            const names = name.split(" ");
            this.#firstName = names.pop();
            this.#lastName = names.join(" ");
        } else {
            this.#firstName = null;
            this.#lastName = null;
        }

        if (role == null || role instanceof Role) {
            this.role = role;
        } else {
            this.role = new Role(role);
        }

        if (manager == null || manager instanceof Employee) {
            this.manager = manager;
        } else {
            this.manager = new Employee(manager, null, null);
        }

        this.id = null;
    }

    getFullName() {
        return this.name;
    }

    getFirstName() {
        return this.#firstName;
    }

    getLastName() {
        return this.#lastName;
    }
}