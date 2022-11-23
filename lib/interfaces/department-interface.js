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
        const res = await this.createEntries(
            this.table, 
            ['dept_name'], 
            [name]
        );

        this.#departments.set(
            res[0].name, 
            new Department(name, res[0].id)
        );

        return res;
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
    
    async delete(department) {
        const departmentId = await this.getId(department);
        if (!(departmentId)) {
            return null;
        }
        // Before deleting the department, update all rolls with this department to null
        const role = new RI(this.sql);
        await role.update('department_id', null, 'department_id', departmentId);
        await role.close();

        return await this.deleteEntry(this.table, "id", departmentId);
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