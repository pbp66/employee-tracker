export default class Department {
    constructor(name) {
        this.name = name;
        this.id = null;
        this.manager = null;
    }

    getBudget() {
        // return the sum of the salaries for the department
    }

    delete() {
        // Delete the department from the SQL table, update all entries with this department, and remove all references to and from this object.
    }
}