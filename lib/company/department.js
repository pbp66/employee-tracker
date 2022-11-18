export default class Department {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.manager = null;
        this.employees = [];
    }

    static getAll() {
        // Use SQL to list all departments
    }

    updateDepartment(id, name, manager, ...employees) {
        this.updateID(id);
        this.updateName(name);
        this.updateManager(manager);
        this.updateEmployees(employees);
    }

    updateID(id) {

    }

    updateName(name) {

    }

    updateManager(manager) {

    }

    updateEmployees(...employees) {

    }

    remove() {

    }
}