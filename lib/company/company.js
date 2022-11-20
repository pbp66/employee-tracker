import { DatabaseInterface as DBI } from "../database-interface.js";

export default class Company {
    #departments = [];
    #roles = [];
    #employees = [];

    constructor(connection) {
        this.sql = new DBI(connection);
    }

    async endSession() {
        return await this.sql.close();
    }

    async updateEmployeeRole(employee, role) {
        const employeeId = await this.getEmployeeId(employee);
        const roleId = await this.getRolesByTitle(role)[0].id;
        const[rows, fields] = await this.updateEmployee("role_id", roleId, "id", employeeId);
        return rows;
    }

    async updateEmployeeManager(employee, manager) {
        const employeeId = await this.getEmployeeId(employee);
        const managerId = await this.getManagerId(manager);
        const [rows, fields] = await this.updateEmployee("manager_id", managerId, "id", employeeId);
        return rows;
    }

    async updateEmployee(field, value, conditionField, conditionValue) {
        // Assumes immediate table entries for field and conditionField
        const [rows, fields] = await this.sql.updateEntry(
            'employees',
            field,
            value,
            conditionField,
            conditionValue
        );
        return rows;
    }

    async deleteEmployee(employee) {
        const employeeId = await this.getEmployeeId(employee);
        await this.updateEntry("employees", "manager_id", null, "manager_id", employeeId);
        const [rows, fields] = await this.sql.deleteEntry("employees", "id", employeeId);
        return rows;
    }

    async deleteRole(role) {
        const roleId = this.getRoleById(role);
        await this.sql.updateEntry("employees", "role_id", null, "role_id", roleId);
        const [rows, fields] = await this.sql.deleteEntry("roles", "id", roleId);
        return rows;
    }

    async deleteDepartment(department) {
        const departmentId = await this.getDepartmentId(department);
        await this.sql.updateEntry("roles", "department_id", null, "department_id", departmentId);
        const [rows, fields] = await this.sql.deleteEntry("departments", "id", departmentId);
        return rows;
    }

    async viewDepartmentBudget(department) {
        const departmentId = await this.getDepartmentId(department);
        const departmentRoles = await this.getEntry("roles", )
    }

    async addEmployee(name, role, manager) {
        const names = name.split(" ");
        const firstName = names.pop();
        const lastName = names.join(" ");

        const roleId = (await this.getRolesByTitle(role))[0].id;

        let managerId = null;
        if (manager != null) {
            managerId = (await this.getEmployeeByName(manager))[0].id;
        }

        const [rows, fields] = await this.sql.newQuery(
            'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);',
            [firstName, lastName, roleId, managerId]
        );
        return rows;
    }

    async viewEmployeesByManager(manager) {
        const managerId = await this.getManagerId(manager);
        const [rows, fields] = await this.sql.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON C.id = ? INNER JOIN departments ON departments.id = roles.department_id;',
            [managerId]
        );
        return rows;
    }

    async getManagerId(manager) {
        let managerId = null;
        if (manager != null) {
            managerId = (await this.getEmployeeId(manager));
        }
        return managerId;
    }

    async getEmployeesByManager(manager) {
        const managerId = await this.getManagerId(manager);
        const [rows, fields] = await this.getEmployeesByManagerId(managerId);
        return rows;
    }

    async viewEmployeesByDepartment(department) {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = ?;',
            [department]
        );
        return rows;
    }

    async getEmployeesByDepartment(department) {
        let departmentId = (await this.getDepartmentByName(department))[0].id;
        const [rows, fields] = await this.sql.newQuery(
            'SELECT * FROM employees WHERE department_id = ?;',
            [departmentId]
        );
        return rows;
    }

    async getEmployeesByName(name) {
        const names = name.trim().split(" ");
        const firstName = names[0], lastName = names[1];
        const [rows, fields] = await this.sql.newQuery(
            'SELECT * FROM ?? WHERE ? = ? AND ? = ?', 
            ['employees', 'first_name', firstName, 'last_name', lastName]
        );
        return rows;
    }

    async getEmployeesByFirstName(firstName) {
        return await this.getEmployee(
            'first_name', 
            firstName
        );
    }

    async getEmployeesByLastName(lastName) {
        return await this.getEmployee(
            'last_name', 
            lastName
        );
    }

    async getEmployeesByRoleId(id) {
        return await this.getEmployee(
            'role_id', 
            id
        );
    }

    async getEmployeesByManagerId(id) {
        return await this.getEmployee(
            'manager_id', 
            id
        );
    }

    async getEmployeeById(id) {
        return await this.getEmployee(
            'id', 
            id
        );
    }

    async getEmployeeId(employee) {
        const employeeId = await this.getEmployeesByName(employee)[0].id;
        return await this.getEmployeeById(employeeId);
    }

    async getEmployee(field, value) {
        const [rows, fields] = await this.sql.getEntry(
            'employees', 
            field, 
            value
        );
        return rows;
    }

    async addRole(title, salary, department) {
        const departmentId = (this.getDepartmentByName(department))[0].id;
        const [rows, fields] = await this.sql.newQuery(
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

    async getRoleId(role) {
        return await (this.getRolesByTitle(role))[0].id;
    }

    async getRole(field, value) {
        const [rows, fields] = await this.sql.getEntry(
            'roles', 
            field, 
            value
        );
        return rows;
    }

    async addDepartment(name) {
        const [rows, fields] = await this.sql.newQuery(
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

    async getDepartmentId(department) {
        return await (this.getDepartmentByName(department))[0].id;
    }

    async getDepartment(field, value) {
        const [rows, fields] = await this.sql.getEntry(
            'departments', 
            field, 
            value
        );
        return rows;
    }

    async getAllEmployees() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT * FROM employees'
        );
        return rows;
    }

    async getAllRoles() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT * FROM roles'
        );
        return rows;
    }

    async getAllDepartments() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT * FROM departments'
        );
        return rows;
    }

    async viewAllEmployees() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = roles.department_id;'
        );
        return rows;
    }

    async viewAllDepartments() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT id AS "ID", dept_name AS "Name" FROM departments'
        );
        return rows;
    }

    async viewAllRoles() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT roles.id AS "ID", title AS "Title", departments.dept_name AS "Department", salary AS "Salary" FROM roles INNER JOIN departments ON roles.department_id = departments.id;'
        );
        return rows;
    }
}