import Role from "./role.js";

export default class Employee {
    #firstName;
    #lastName;
    
    constructor(name, role, manager) {
        this.name;
        const names = name.split(" ");
        this.#firstName = names.pop();
        this.#lastName = names.join(" ");

        this.role = role;
        this.manager = manager;
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

    updateManager(manager) {
        // set the object's new manager.
        // use SQL to update the manager in the table.
    }

    updateRole(role) {
        // set the object's new role.
        // use SQL to update the role in the table.
    }

    delete() {
        // Delete the employee from the SQL table, update all entries with this employee, and remove all references to and from this object.
    }
}