import Department from "./department.js";
import Role from "./role.js";
import Employee from "./employee.js";
import mysql from "mysql2/promise";

export default class Company {
    #departments = [];
    #roles = [];
    #employees = [];
    constructor() {
        // Empty
    }

    async getConnection() {
        return await mysql.createConnection({
            host: 'localhost',
            user: 'james',
            password: '',
            database: 'employees'
        });
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

    async addRole(name, salary, department) {
        const sql = await this.getConnection();
        const role = new Role(name, salary, department);

        // Assign department ID if it wasn't provided.
        if (role.department.id == null) {
            const [resultHeader1] = await sql.execute('SELECT id FROM departments WHERE dept_name = ?', [role.department.name]);
            if (resultHeader1.length === 0) {
            // If department doesn't exist yet, create it before running SQL script
            role.department = await this.addDepartment(role.department);
            } else {
                role.department.id = resultHeader1[0].id;
            }
        }
        const [resultHeader2] = await sql.execute('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [role.title, role.salary, role.department.id]);
        role.id = resultHeader2.insertId;
        this.#roles.push(role);
        await sql.end();
        return role;
    }

    async addDepartment(name) {
        const sql = await this.getConnection();
        const department = new Department(name);
        const [resultHeader] = await sql.execute('INSERT INTO departments (dept_name) VALUES (?)', [department.name]);
        department.id = resultHeader.insertId;
        this.#departments.push(department);
        await sql.end();
        return department;
    }

    getEmployeesByManager(manager) {

    }

    getEmployeesByDepartment(department) {

    }

    async getAllEmployees() {
        const sql = await this.getConnection();
        const [rows, fields] = await this.sql.connection.execute('SELECT employees.id, first_name, last_name, roles.title, department.dept_name, roles.salary FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = department.id;');
        await sql.end();
        return rows;
    }

    async getAllDepartments() {
        const sql = await this.getConnection();
        const [rows, fields] = await sql.execute('SELECT id AS "ID", dept_name AS "Name" FROM departments');
        await sql.end();
        return rows;
    }

    async getAllRoles() {
        const sql = await this.getConnection();
        const [rows, fields] = await this.sql.connection.execute('SELECT roles.id, title, departments.dept_name, salary FROM roles INNER JOIN departments ON roles.department_id = departments.id;');
        await sql.end();
        return rows;
    }
}