import DBI from "./database-interface.js";
import DI from "./department-interface.js";
import RI from "./role-interface.js";
import Employee from "../tables/employee.js";
import Role from "../tables/role.js";

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
            await this.getManager(await this.getManagerId(manager)) 
        );

        const [rows, fields] = await this.newQuery(
            `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`,
            [
                e.getFirstName(), 
                e.getLastName(),
                e.role.id, 
                e.manager ? e.manager.id : null
            ]
        );

        e.id = rows.insertId;
        this.#employees.set(e.id, e);
        return this.#employees.get(e.id).view();
    }

    async getEmployeesByManager(managerName) {
        return await this.getEmployeesByManagerId(
            await this.getId(managerName)
        );
    }

    async getEmployeesByDepartment(deptName) {
        const departmentId = (await this.#getDepartment(deptName)).id;
        const [rows, fields] = await this.newQuery(
            'SELECT DISTINCT E.id AS "ID", CONCAT(E.first_name, " ", E.last_name) AS "Name", roles.title AS "Title", CONCAT(M.first_name, " ", M.last_name) AS "Manager" FROM employees E INNER JOIN roles ON E.role_id = roles.id AND roles.department_id = ? LEFT JOIN employees M on M.id = E.manager_id;',
            [departmentId]
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

    async getAllEmployeeNames() {
        const names = [];
        const employees = await this.getAll();
        for (const employee of employees) {
            names.push(employee.first_name + " " + employee.last_name);
        }
        return names;
    }

    async getId(fullName) {
        const names = fullName.trim().split(" ");
        const firstName = names[0], lastName = names[1];
        const [rows, fields] = await this.newQuery(
            'SELECT * FROM employees WHERE first_name = ? AND last_name = ?', 
            [firstName, lastName]
        );
        return rows[0].id;
    }

    async getManager(id) {
        if (id == null) {
            return null;
        }
        return await this.getEmployee(id);
    }

    async getManagerId(manager) {
        if (!manager || manager === "NULL") {
            return null;
        } else {
            return await this.getId(manager);
        }
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
                    this.getManager(res.manager_id),
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

    async updateFirstName(id, newFirstName) {
        const e = await this.getEmployee(id);
        e.setFirstName(newFirstName);

        await this.newQuery(
            `UPDATE employees SET first_name = ? WHERE id = ?`,
            [newFirstName, id]    
        );
        return e.view();
    }

    async updateLastName(id, newLastName) {
        const e = await this.getEmployee(id);
        e.setLastName(newLastName);

        await this.newQuery(
            `UPDATE employees SET last_name = ? WHERE id = ?`,
            [newLastName, id]    
        );
        return e.view();
    }

    async updateName(id, newName) {
        const e = await this.getEmployee(id);
        e.setFullName(newName);
        await this.updateFirstName(id, e.getFirstName());
        await this.updateLastName(id, e.getLastName());
        return e.view();
    }

    async updateRole(id, title) {
        const e = await this.getEmployee(id);
        const role = await this.#getRole(title);
        e.role = new Role(role.title, role.salary, role.department, role.id);
        
        await this.newQuery(
            `UPDATE employees SET role_id = ? WHERE id = ?`,
            [role.id, id]    
        );
        return e.view();
    }

    async updateManager(employeeId, manager) {
        const e = await this.getEmployee(employeeId);
        let managerId;
        if (!manager || manager === "NULL") {
            e.manager = null;
            managerId = null;
        } else {
            const m = await this.getManager(await this.getId(manager));
            e.manager = new Employee(m.name, m.role, m.manager, m.id);
            managerId = m.id;
        }

        await this.newQuery(
            `UPDATE employees SET manager_id = ? WHERE id = ?`,
            [managerId, employeeId]    
        );
        return e.view();
    }

    async updateEmployee(name, attributeToUpdate, newValue) {
        const id = await this.getId(name);
        switch(attributeToUpdate) {
            case('Full Name'):
                return await this.updateName(id, newValue);
            case('First Name'):
                return await this.updateFirstName(id, newValue);
            case('Last Name'):
                return await this.updateLastName(id, newValue);
            case('Role'):
                return await this.updateRole(id, newValue);
            case('Manager'):
                return await this.updateManager(id, newValue);
        }
    }


    async delete(employee) {
        const employeeId = await this.getId(employee);
        if (!(employeeId)) {
            return null;
        }
        // Before deleting employee, update any employees sharing this employee as their manager to null
        await this.newQuery(
            'UPDATE employees SET manager_id = NULL WHERE manager_id = ?',
            [employeeId]
        );
        this.#employees.delete(employeeId);
        await this.deleteEntry(this.table, "id", employeeId);

        console.log(`\n${employee} deleted successfully. Updated list of all employee:\n`)
        return await this.viewAllEmployees();
    }

    async getAll() {
        return await this.getAllEntries(this.table);
    }

    async viewEmployeesByDepartment(deptName) {
        const departmentId = (await this.#getDepartment(deptName)).id;
        const [rows, fields] = await this.newQuery(
            "SELECT employees.id AS 'ID', first_name AS 'First Name', last_name AS 'Last Name', roles.title AS 'Title', roles.salary AS 'Salary', CONCAT(first_name, ' ', last_name) AS 'Manager' FROM employees INNER JOIN roles ON role_id = roles.id AND roles.department_id = ?;",
            [departmentId]
        );
        if (rows.length === 0) {
            return {"message": `No Employees Listed for ${deptName}`}
        }
        return rows;
    }

    async viewEmployeesByManager(manager) {
        const managerId = await this.getId(manager);
        const [rows, fields] = await this.newQuery(
            `SELECT E.id AS "ID", E.first_name AS "First Name", E.last_name AS "Last Name", roles.title AS "Title", departments.dept_name AS "Department", roles.salary AS "Salary", CONCAT(M.first_name, " ", M.last_name) AS "Manager" FROM employees E INNER JOIN roles ON E.role_id = roles.id INNER JOIN employees M ON E.manager_id = M.id INNER JOIN departments ON departments.id = roles.department_id WHERE E.manager_id = ?;`,
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
        return role;
    }

    async #getRoleFromId(id) {
        const roleInterface = new RI(this.sql);
        const role = await roleInterface.getRole(
            (await roleInterface.get('id', id))[0].title
        );
        return role;
    } 

    async #getDepartment(name) {
        const deptInterface = new DI(this.sql);
        const dept = await deptInterface.getDepartment(name);
        return dept;
    }
}