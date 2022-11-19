export default class Role {
    constructor(name, salary, department) {
        this.title = name;
        this.salary = salary;
        this.department = department;

        this.id = null;
    }

    delete() {
        // Delete the role from the SQL table, update all entries with this role, and remove all references to and from this object.
    }
}