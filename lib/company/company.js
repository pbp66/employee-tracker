import Department from "./department.js";
import Role from "./role.js";
import Employee from "./employee.js";
import SQL from "../sql.js";

export default class Company {
    constructor() {
        this.sql = new SQL('localhost', 'james', '', 'employees');
    }

    getConnection() {
        return this.sql;
    }

    setNewConnection(mysqlConnection) {
        this.sql = mysqlConnection;
    }

    async addEmployee(name, role, manager) {
        const employee = new Employee(name, role, manager);
        const response = await this.sql.execute('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);', 
            [employee.getFirstName(), employee.getLastName(), employee.role.id, employee.manager.id]);
    }

    async addRole(name, salary, department) {
        const role = new Role(name, salary, department);
        await this.sql.execute('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [role.name, role.salary, role.department.id]);
    }

    async addDepartment(name) {
        const department = new Department(name);
        const response = await this.sql.execute('INSERT INTO departments (dept_name) VALUES (?)', [department.name]);
    }

    getEmployeesByManager(manager) {

    }

    getEmployeesByDepartment(department) {

    }

    async getAllEmployees() {
        return await this.sql.execute('SELECT employees.id, first_name, last_name, roles.title, department.dept_name, roles.salary FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = department.id;');
    }

    async getAllDepartments() {
        return await this.sql.execute('SELECT id, dept_name FROM departments');
    }

    async getAllRoles() {
        return await this.sql.employee('SELECT roles.id, title, departments.dept_name, salary FROM roles INNER JOIN departments ON roles.department_id = departments.id;');
    }
}