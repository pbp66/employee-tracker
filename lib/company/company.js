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

    addEmployee(name, role, manager) {
        const employee = new Employee(name, role, manager);
        const response = this.sql.connection.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);',
            [employee.getFirstName(), employee.getLastName(), employee.role.id, employee.manager.id]);

    }

    async addRole(name, salary, department) {
        const sql = await this.getConnection();
        const role = new Role(name, salary, department);

        // Assign department ID if it wasn't provided.
        if (role.department.id === null) {
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