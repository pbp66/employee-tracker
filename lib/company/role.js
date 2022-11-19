import SQL from "./sql.js";
import Department from "./department.js";

export default class Role extends SQL {
    constructor(name, salary, department) {
        super('localhost', 'james', '', 'employees');
        this.sql = this.connection;

        this.title = name;
        this.salary = salary;
        this.department = new Department(department);

        this.id = null;
        this.updateDepartment();
    }

    async updateDepartment() {
        const response = await this.sql.execute('SELECT id FROM department WHERE dept_name = ?', [this.department.name]);

        // this.department.id = response.???

        // If response fails or is null... Need to add entry into department table as well
    }

    delete() {
        // Delete the role from the SQL table, update all entries with this role, and remove all references to and from this object.
    }
}