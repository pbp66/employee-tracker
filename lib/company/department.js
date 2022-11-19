export default class Department {
    #employees = [];
    constructor(name) {
        this.name = name;

        this.id = null;
        this.manager = null;
    }

    updateDepartment(id, name, manager, ...employees) {
        this.updateID(id);
        this.updateName(name);
        this.updateManager(manager);
        this.updateEmployees(employees);
    }

    updateID(id) {
        // set the object's new ID.
        // use SQL to update the ID in the table.
    }

    updateName(name) {
        // set the object's new name.
        // use SQL to update the name in the table.
    }

    updateManager(manager) {
        // set the object's new manager.
        // use SQL to update the manager in the table.
    }

    updateEmployees(...employees) {
        // set the object's new employee list.
        // use SQL to update all employees in the table.
    }

    getBudget() {
        // return the sum of the salaries for the department
    }

    delete() {
        // Delete the department from the SQL table, update all entries with this department, and remove all references to and from this object.
    }
}