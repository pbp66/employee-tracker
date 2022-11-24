import DBI from "./database-interface.js";
import RI from "./role-interface.js";
import Department from "../tables/department.js";

export default class DepartmentInterface extends DBI {   
    #departments = new Map();

    constructor(conn) {
        super(conn);
        this.table = "departments";
    }

    async initialize() {
        const departments = await this.getAllEntries(this.table);
        for (const department of departments) {
            if (!this.#departments.has(department.name)) {
                this.#departments.set(
                    department.name, 
                    new Department(department.name, department.id)
                );
            }
        }
    }

    async add(name) {
        const [rows, fields] = await this.newQuery(
            `INSERT INTO departments (dept_name) VALUES (?)`,
            [name]
        );
        this.#departments.set(
            name, 
            new Department(name, rows.insertId)
        );

        return this.#departments.get(name);
    }

    async getId(department) {
        return (await this.getDepartment(department)).id;
    }

    async getDepartment(department) {
        if (this.#departments.has(department)) {
            return this.#departments.get(department);
        } else {
            const res = await this.get("dept_name", department);
            if (res.length !== 0) {
                const dept = new Department(res[0].dept_name, res[0].id);
                this.#departments.set(dept.name, dept);
                return dept;
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
    
    async getAllDepartmentNames() {
        const names = [];
        const departments = await this.getAll();
        for (const department of departments) {
            names.push(department.dept_name);
        }
        return names;
    }

    async delete(department) {
        console.log(department);
        const departmentId = await this.getId(department);
        if (!(departmentId)) {
            return null;
        }

        await this.newQuery(
            `UPDATE roles SET department_id = NULL WHERE department_id = ?`,
            [departmentId]
        );
        this.#departments.delete(department);
        await this.deleteEntry(this.table, "id", departmentId);
        return await this.viewAllDepartments();
    }

    async viewBudget(department) {
        const departmentId = await this.getId(department);
        if (!(departmentId)) {
            return null;
        }

        const [rows, fields] = await this.newQuery(
            `SELECT SUM(roles.salary) As 'Budget' FROM employees INNER JOIN roles ON role_id = roles.id AND roles.department_id = 5;`, 
            [departmentId]
        );

        return rows;
    }
    
    async viewAllDepartments() {
        const [rows, fields] = await this.newQuery(
            'SELECT id AS "ID", dept_name AS "Name" FROM departments'
        );
        return rows;
    }
}