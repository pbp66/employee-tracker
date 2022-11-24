import DBI from "./database-interface.js";
import DI from "./department-interface.js";
import EI from "./employee-interface.js";
import Department from "../tables/department.js";1
import Role from "../tables/role.js";

export default class RoleInterface extends DBI {
    #roles = new Map();

    constructor(conn) {
        super(conn);
        this.table = "roles";
    }

    async initialize() {
        const roles = await this.getAllEntries(this.table);
        for (const role of roles) {
            if (!this.#roles.has(role.title)) {
                this.#roles.set(
                    role.title, 
                    new Role(
                        role.title, 
                        role.salary, 
                        await this.#getDepartmentFromId(role.department_id), 
                        role.id
                    )
                );
            }
        }
    }

    async add(title, salary, deptName) {
        const department = await this.#getDepartment(deptName);
        const [rows, fields] = await this.newQuery(
            `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`,
            [title, salary, department.id]
        );

        this.#roles.set(
            title,
            new Role(title, salary, department, rows.insertId)
        );

        return this.#roles.get(title).view();
    }

    async getSalary(title) {
        return (await this.getRole(title)).salary;
    }

    async getDepartment(title) {
        return (await this.getRole(title)).department;;
    }

    async getId(title) {
        return (await this.getRole(title)).id;
    }

    async getRole(title) {
        if (this.#roles.has(title)) {
            return this.#roles.get(title).view();
        } else {
            const res = await this.get('title', title);
            if (res.length !== 0) {               
                const r = new Role(
                    res[0].title, 
                    res[0].salary, 
                    await this.#getDepartmentFromId(res[0].department_id), 
                    res[0].id
                );
                this.#roles.set(r.title, r);
                return r.view();
            } else {
                return null;
            }
        }
    }

    async get(field, value) {
        return await this.getEntry(this.table, field, value);
    }

    async getAll() {
        return await this.getAllEntries(this.table);
    }

    async getAllTitles() {
        const titles = [];
        const roles = await this.getAllEntries(this.table);
        for (const role of roles) {
            titles.push(role.title);
        }
        return titles;
    }

    async updateTitle(oldTitle, newTitle) {
        const r = this.#roles.get(oldTitle);
        this.#roles.delete(oldTitle);
        r.title = newTitle;
        this.#roles.set(r.title, r);

        await this.newQuery(
            `UPDATE roles SET title = ? WHERE id = ?`,
            [newTitle, r.id]
        );

        return r.view();
    }

    async updateSalary(title, newSalary) {
        const r = this.#roles.get(title);
        r.salary = newSalary;

        await this.newQuery(
            `UPDATE roles SET salary = ? WHERE id = ?`,
            [newSalary, r.id]
        );

        return r.view();
    }

    async updateDepartment(title, newDepartment) {
        const dept = await this.#getDepartment(newDepartment);
        const r = this.#roles.get(title);
        r.department = new Department(dept.name, dept.id);

        await this.newQuery(
            `UPDATE roles SET department_id = ? WHERE id = ?`,
            [r.department.id, r.id]
        );

        return r.view();
    }

    async updateRole(roleTitle, attributeToUpdate, newValue) {
        switch(attributeToUpdate) {
            case('Title'):
                return await this.updateTitle(roleTitle, newValue);
            case('Salary'):
                return await this.updateSalary(roleTitle, newValue);
            case('Department'):
                return await this.updateDepartment(roleTitle, newValue);
        }
    }

    async delete(title) {
        const roleId = await this.getId(title);
        if (!(roleId)) {
            return null;
        }
        // Before deleting the role, update all employees with this role to null
        await this.newQuery(
            `DELETE FROM employees WHERE role_id = ?`,
            [roleId]
        );
        this.#roles.delete(title);
        await this.deleteEntry("roles", "id", roleId);
        console.log(`\n${title} deleted successfully. Updated list of all roles:\n`)
        return await this.viewAllRoles();
    }

    async viewAllRoles() {
        const [rows, fields] = await this.newQuery(
            'SELECT roles.id AS "ID", title AS "Title", departments.dept_name AS "Department", salary AS "Salary" FROM roles INNER JOIN departments ON roles.department_id = departments.id;'
        );
        return rows;
    }

    async #getDepartment(deptName) {
        const [rows, fields] = await this.newQuery(
            `SELECT * FROM departments WHERE dept_name = ?`,
            [deptName]
        )
        if (rows.length === 0) {
            throw new ReferenceError("Department doesn't exist");
        }

        let department = rows[0];
        const {dept_name: name, id: deptId} = department;
        department = new Department(name, deptId);
        return department;
    }

    async #getDepartmentFromId(id) {
        const [rows, fields] = await this.newQuery(
            `SELECT * FROM departments WHERE id = ?`,
            [id]
        );
        if (rows.length === 0) {
            throw new ReferenceError("Department doesn't exist");
        }

        let department = rows[0];
        const {dept_name: name, id: deptId} = department;
        department = new Department(name, deptId);
        return department;
    }
}