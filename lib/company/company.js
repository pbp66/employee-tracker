import Department from "./department.js";
import Role from "./role.js";
import Employee from "./employee.js";
import SQL from "../sql/sql.js";

export default class Company {
    #departments = [];
    #roles = [];
    #employees = [];
    constructor(connection) {
        this.sql = connection;
    }

    // TODO: Refactor to implement DRY. Several pieces of repeated code below

    async addEmployee(name, role, manager) {
        const sql = await this.getConnection();
        const employee = new Employee(name, role, manager);

        if (employee.role.id == null) {
            const [resultHeader1] = await sql.execute('SELECT id, salary, department_id FROM roles WHERE title = ?', [employee.role.title]);
            employee.role.id = resultHeader1[0].id;
            employee.role.salary = resultHeader1[0].salary;

            const [resultHeader2] = await sql.execute('SELECT dept_name FROM departments WHERE id = ?', [resultHeader1[0].department_id]);
            employee.role.department = new Department(resultHeader2[0].dept_name);
            employee.role.id = resultHeader1[0].department_id;
        }

        if (employee.manager != null && employee.manager.id == null) {
            const [resultHeader3] = await sql.execute('SELECT id, role_id, manager_id FROM employees WHERE first_name = ? AND last_name = ?', [employee.manager.getFirstName(), employee.manager.getLastName()]);
            employee.manager.id = resultHeader3[0].id;
            
            const [resultHeader4] = await sql.execute('SELECT id, title, salary, department_id FROM roles WHERE id = ?', [resultHeader3[0].role_id]);
            const [resultHeader5] = await sql.execute('SELECT dept_name FROM departments WHERE id = ? ', [resultHeader4[0].department_id]);
            employee.manager.role = new Role(resultHeader4[0].title, resultHeader4[0].salary, resultHeader5[0].id);

            if (resultHeader3[0].manager_id != null) {
                // TODO: Implement getManager() method
            }
        } else if (employee.manager == null) {
            employee.manager = new Employee(null, null, null);
        }

        const [resultHeader5] = await sql.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);',
            [employee.getFirstName(), employee.getLastName(), employee.role.id, employee.manager.id]);
        employee.id = resultHeader5.id;
        this.#employees.push(employee);
        await sql.end();
        return employee;
    }

    async addRole(title, salary, department) {
        const departmentId = (this.getDepartmentByName(department))[0].id;
        const [rows, fields] = await (await this.sql).newQuery(
            'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', 
            [title, salary, departmentId]
        );
        return rows;
    }

    async getRolesBySalary(salary) {
        return await this.getRole(
            'salary', 
            salary
        );
    }

    async getRolesByDepartmentId(id) {
        return await this.getRole(
            'department_id', 
            id
        );
    }

    async getRolesByTitle(title) {
        return await this.getRole(
            'title', 
            title
        );
    }

    async getRoleById(id) {
        return await this.getRole(
            'id', 
            id
        );
    }

    async getRole(field, value) {
        const [rows, fields] = await this.sql.getMatchingEntry(
            'roles', 
            field, 
            value
        );
        return rows;
    }

    async addDepartment(name) {
        const [rows, fields] = await (await this.sql).newQuery(
            'INSERT INTO departments (dept_name) VALUES (?)', 
            [name]
        );
        return rows;
    }

    async getDepartmentByName(name) {
        return await this.getDepartment(
            'dept_name', 
            name
        );
    }

    async getDepartmentById(id) {
        return await this.getDepartment(
            'id', 
            id
        );
    }

    async getDepartment(field, value) {
        const [rows, fields] = await this.sql.getMatchingEntry(
            'departments', 
            field, 
            value
        );
        return rows;
    }

    getEmployeesByManager(manager) {

    }

    getEmployeesByDepartment(department) {

    }

    async getAllEmployees() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT * FROM employees'
        );
        return rows;
    }

    async getAllRoles() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT * FROM roles'
        );
        return rows;
    }

    async getAllDepartments() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT * FROM departments'
        );
        return rows;
    }

    async viewAllEmployees() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = roles.department_id;'
        );
        return rows;
    }

    async viewAllDepartments() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT id AS "ID", dept_name AS "Name" FROM departments'
        );
        return rows;
    }

    async viewAllRoles() {
        const [rows, fields] = await (await this.sql).newQuery(
            'SELECT roles.id AS "ID", title AS "Title", departments.dept_name AS "Department", salary AS "Salary" FROM roles INNER JOIN departments ON roles.department_id = departments.id;'
        );
        return rows;
    }
}