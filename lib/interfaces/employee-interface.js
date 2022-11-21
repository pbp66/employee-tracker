import { DatabaseInterface as DBI } from "./database-interface.js";
import { RoleInterface as RI } from "./department-interface.js";
import Role from "./role-interface.js";
import Employee from "../tables/employee.js";

export default class EmployeeInterface extends DBI {
    #employees = new Map();

    constructor(conn) {
        super(conn);
        this.table = "employees";
    }

    async initialize() {
        const employees = await this.getAllEntries();
        for (const role of roles) {
            if (!this.#roles.has(role.title)) {
                this.#roles.set(
                    role.title, 
                    new Role(
                        role.title, 
                        role.salary, 
                        this.#getDepartmentFromId(role.department_id), 
                        role.id
                    )
                );
            }
        }
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

    async updateFirstName(employee, firstName) {
        const e = this.#employees.get(employee);
        e.setFirstName(firstName);
        return await this.updateEmployee('first_name', firstName, e.id);
    }

    async updateLastName(employee, lastName) {
        const e = this.#employees.get(employee);
        e.setLastName(lastName);
        return await this.updateEmployee('last_name', lastName, e.id);
    }

    async updateName(employee, name) {
        const e = this.#employees.get(employee);
        e.setFullName(name);
        const res1 = await this.updateEmployee('first_name', e.getFirstName(), e.id);
        const res2 = await this.updateEmployee('last_name', e.getLastName(), employee.id);
    }

    async updateRole(employee, role) {
        const employeeId = await this.#employees.get(employee)
        const role = await this.#getRole(role);
        return await this.updateEmployee("role_id", role.id, employeeId);
    }

    async updateManager(employee, manager) {
        const employeeId = await this.getEmployeeId(employee);
        const managerId = await this.getManagerId(manager);
        return await this.updateEmployee('manager_id', managerId, employeeId);
    }

    async updateEmployee(field, value, employeeId) {
        return await this.update(field, value, 'id', employeeId);
    }

    async update(field, value, conditionField, conditionValue) {
        // Assumes immediate table entries for field and conditionField
        return await this.sql.updateEntry(
            'employees',
            field,
            value,
            conditionField,
            conditionValue
        );
    }

    async deleteEmployee(employee) {
        const employeeId = await this.getEmployeeId(employee);
        if (!(employeeId)) {
            return null;
        }
        // Before deleting employee, update any employees sharing this employee as their manager to null
        await this.update("manager_id", null, "manager_id", employeeId);
        return await this.deleteEntry(this.table, "id", employeeId);
    }

    async getAll() {
        return await this..getAllEntries(this.table);
    }

    async viewAllEmployees() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = roles.department_id;'
        );
        return rows;
    }

    async #getRole(role) {
        const roleInterface = new RI(this.sql);
        const role = await roleInterface.getRole(role);
        await roleInterface.close();
        return role;
    }
}