import { DatabaseInterface as DBI } from "./database-interface.js";
import { DepartmentInterface as DI } from "./department-interface.js";
import { EmployeeInterface as EI } from "./employee-interface.js";
import Department from "../tables/department.js";
import Role from "../tables/role.js";

export default class RoleInterface extends DBI {
    #roles = new Map();

    constructor(conn) {
        super(conn);
        this.table = "roles";
    }

    async initialize() {
        const roles = await this.getAllEntries();
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

    async add(title, salary, department) {
        const department = this.#getDepartment(department);
        if (department.length === 0) {
            return null;
        }

        const res = await this.createEntries(
            this.table,
            ['title', 'salary', 'department_id'],
            [title, salary, department.id]
        );

        this.#roles.set(
            title,
            new Role(title, salary, department, res.id)
        );

        return res;
    }

    async getSalary(role) {
        return (await this.getRole(role))[0].salary;
    }

    async getDepartment(role) {
        return (await this.getRole(role))[0].department;
    }

    async getId(role) {
        return await (this.get('title', role))[0].id;
    }

    async getRole(role) {
        if (this.#roles.has(role)) {
            return this.#roles.get(role);
        } else {
            const res = await this.get('title', role);
            if (res.length !== 0) {               
                const role = new Role(
                    res[0].title, 
                    res[0].salary, 
                    this.#getDepartmentFromId(res[0].department_id), 
                    res[0].id
                );
                this.#roles.set(role.title, role);

                return role;
            } else {
                return null;
            }
        }
    }

    async get(field, value) {
        return await this.getEntry(
            'roles', 
            field, 
            value
        );
    }

    async updateTitle(role) {
        const r = this.#roles.get(role);
        this.#roles.delete(role);
        r.title = title;
        this.#roles.set(r.title, r);
        return await this.updateRole('title', role, role);
    }

    async updateSalary(role, salary) {
        const r = this.#roles.get(role);
        r.salary = salary;
        return await this.updateRole('salary', salary, role);
    }

    async updateDepartment(role, department) {
        const dept = this.#getDepartment(department);
        const r = this.#roles.get(role);
        r.department = new Department(dept.name, dept.id);
        return await this.updateRole('department_id', r.department.id, role);
    }

    async updateRole(field, value, role) {
        return await this.update(field, value, 'title', role);
    }

    async update(field, value, conditionField, conditionValue) {
        return await this.updateEntry(
            this.table, 
            field, 
            value, 
            conditionField, 
            conditionValue
        );
    }

    async deleteRole(role) {
        const roleId = await this.getRoleId(role);
        if (!(roleId)) {
            return null;
        }
        // Before deleting the role, update all employees with this role to null
        const employee = new EI(this.sql);
        await employee.update('role_id', null, 'role_id', roleId);
        await employee.close();

        return await this.deleteEntry("roles", "id", roleId);
    }

    async getAll() {
        return await this..getAllEntries(this.table);
    }

    async viewAllRoles() {
        const [rows, fields] = await this.sql.newQuery(
            'SELECT roles.id AS "ID", title AS "Title", departments.dept_name AS "Department", salary AS "Salary" FROM roles INNER JOIN departments ON roles.department_id = departments.id;'
        );
        return rows;
    }

    async #getDepartment(department) {
        const deptInterface = new DI(this.sql);
        const department = await deptInterface.getDepartment(department);
        await deptInterface.close();
        return department;
    }

    async #getDepartmentFromId(id) {
        const deptInterface = new DI(this.sql);
        let department = await deptInterface.get('id', id);
        await deptInterface.close();
        if (department.length === 0) {
            throw new ReferenceError("Department doesn't exist");
        }
        department = new Department( {dept_name, id} = department[0]);
    }
}