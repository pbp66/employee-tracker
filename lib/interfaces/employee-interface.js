import DBI from "./database-interface.js";
import DI from "./department-interface.js";
import RI from "./role-interface.js";
import Employee from "../tables/employee.js";

export default class EmployeeInterface extends DBI {
    #employees = new Map();

    constructor(conn) {
        super(conn);
        this.table = "employees";
    }

    async initialize() {
        const employees = await this.getAllEntries(this.table);
        for (const employee of employees) {
            if (!this.#employees.has(employee.id)) {
                const name = employee.first_name + ' ' + employee.last_name;
                this.#employees.set(
                    employee.id, 
                    new Employee(
                        name,
                        await this.#getRoleFromId(employee.role_id),
                        await this.getEmployee(employee.manager_id),
                        employee.id
                    )
                );
            }
        }
    }

    async add(name, role, manager) {
        const e = new Employee(
            name, 
            await this.#getRole(role),
            await this.getEmployee(await this.getId(manager)) 
        );

        const res = await this.createEntries(
            this.table,
            ['full_name', 'last_name', 'role_id', 'manager_id'],
            [e.getFirstName(), e.getLastName(), e.role.id, e.manager.id]
        );
        e.id = res[0].id;
        this.#employees.set(e.id, e);
        return res;
    }

    async getManager(employeeName) {
        return (await this.getEmployeeByName(employeeName)).manager;
    }

    async getEmployeesByManager(managerName) {
        return await this.getEmployeesByManagerId(
            await this.getId(managerName)
        );
    }

    async getEmployeesByDepartment(deptName) {
        const departmentId = (await this.#getDepartment(deptName)).id;
        const [rows, fields] = await this.newQuery(
            'SELECT employees.id, first_name, last_name, role_id, manager_id, dept_name FROM employees INNER JOIN roles ON role_id = roles.id AND roles.department_id = ? INNER JOIN departments ON departments.id = ?;',
            [departmentId, departmentId]
        );
        return rows;
    }

    async getEmployeeByName(fullName) {
        return await this.getEmployee(await this.getId(fullName));
    }

    async getEmployeesByFirstName(firstName) {
        return await this.getEmployee('first_name', firstName);
    }

    async getEmployeesByLastName(lastName) {
        return await this.getEmployee('last_name', lastName);
    }

    async getEmployeesByRoleId(id) {
        return await this.get('role_id', id);
    }

    async getEmployeesByManagerId(id) {
        return await this.get('manager_id', id);
    }

    async getId(fullName) {
        const names = fullName.trim().split(" ");
        const firstName = names[0], lastName = names[1];
        const [rows, fields] = await this.newQuery(
            'SELECT * FROM ?? WHERE ? = ? AND ? = ?', 
            [this.table, 'first_name', firstName, 'last_name', lastName]
        );
        return rows[0].id;
    }

    async getEmployee(id) {
        if (this.#employees.has(id)) {
            return this.#employees.get(id);
        } else {
            const res = await this.get('id', id);

            if (res.length !== 0) {
                const e = new Employee(
                    '', 
                    this.#getRoleFromId(res.role_id),
                    this.getEmployee(res.manager_id),
                    res.id
                );

                e.setFirstName(res.first_name);
                e.setLastName(res.last_name);
                this.#employees.set(e.id, e);

                return e;
            } else {
                return null;
            }
        }
    }

    async get(field, value) {
        return await this.getEntry(
            this.table, 
            field, 
            value
        );
    }

    async updateFirstName(fullName, firstName) {
        const e = await this.getEmployee(await this.getId(fullName));
        e.setFirstName(firstName);
        return await this.updateEmployee('first_name', firstName, e.id);
    }

    async updateLastName(fullName, lastName) {
        const e = await this.getEmployee(await this.getId(fullName));
        e.setLastName(lastName);
        return await this.updateEmployee('last_name', lastName, e.id);
    }

    async updateName(oldName, name) {
        const e = await this.getEmployee(await this.getId(oldName));
        e.setFullName(name);
        const res1 = await this.updateEmployee(
            'first_name',
             e.getFirstName(), 
             e.id
            );
        const res2 = await this.updateEmployee(
            'last_name', 
            e.getLastName(), 
            e.id
        );
        return [...res1, ...res2];
    }

    async updateRole(name, title) {
        const e = await this.getEmployee(await this.getId(name));
        const role = await this.#getRole(title);
        e.role = new Role(role.title, role.salary, role.department, role.id);
        return await this.updateEmployee("role_id", role.id, e.id);
    }

    async updateManager(employee, manager) {
        const e = await this.getEmployee(employee);
        const m = await this.getEmployee(manager);
        e.manager = new Employee(m.name, m.role, m.manager, m.id);
        return await this.updateEmployee('manager_id', m.id, e.id);
    }

    async updateEmployee(field, value, employeeId) {
        return await this.update(field, value, 'id', employeeId);
    }

    async update(field, value, conditionField, conditionValue) {
        // Assumes immediate table entries for field and conditionField
        return await this.updateEntry(
            this.table,
            field,
            value,
            conditionField,
            conditionValue
        );
    }

    async deleteEmployee(employee) {
        const employeeId = await this.getId(await this.getId(employee));
        if (!(employeeId)) {
            return null;
        }
        // Before deleting employee, update any employees sharing this employee as their manager to null
        await this.update("manager_id", null, "manager_id", employeeId);
        return await this.deleteEntry(this.table, "id", employeeId);
    }

    async getAll() {
        return await this.getAllEntries(this.table);
    }

    async viewEmployeesByDepartment(deptName) {
        const departmentId = (await this.#getDepartment(deptName)).id;
        const [rows, fields] = await this.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = ?;',
            [departmentId]
        );
        return rows;
    }

    async viewEmployeesByManager(manager) {
        const managerId = await this.getId(manager);
        const [rows, fields] = await this.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON C.id = ? INNER JOIN departments ON departments.id = roles.department_id;',
            [managerId]
        );
        return rows;
    }

    async viewAllEmployees() {
        const [rows, fields] = await this.newQuery(
            'SELECT P.id AS "ID", P.first_name AS "First Name", P.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(C.first_name, " ", C.last_name) AS "Manager" FROM employees P LEFT JOIN roles ON P.role_id = roles.id LEFT JOIN employees C ON P.manager_id = C.id INNER JOIN departments ON departments.id = roles.department_id;'
        );
        return rows;
    }

    async #getRole(title) {
        const roleInterface = new RI(this.sql);
        const role = await roleInterface.getRole(title);
        await roleInterface.close();
        return role;
    }

    async #getRoleFromId(id) {
        const roleInterface = new RI(this.sql);
        const role = await roleInterface.getRole(
            (await roleInterface.get('id', id))[0].title
        );
        //await roleInterface.close();
        return role;
    } 

    async #getDepartment(name) {
        const deptInterface = new DI(this.sql);
        const dept = await deptInterface.getDepartment(name);
        //await deptInterface.close();
        return dept;
    }
}