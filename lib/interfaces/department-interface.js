import { DatabaseInterface as DBI } from "./database-interface.js";
import Department from "../tables/department.js";

export default class DepartmentInterface extends DBI {   
    #departments = new Map();

    constructor(conn) {
        super(conn);
        this.table = "departments";
    }

    async add(name) {
        const [rows, fields] = await this.createEntries(
            this.table, 
            ['dept_name'], 
            name
        );
        this.#departments.set(
            rows[0].name, 
            new Department(rows[0].dept_name, rows[0].id)
        );
        return rows;
    }

    async getId(department) {
        if (this.#departments.has(department)) {
            return this.#departments.get(department);
        } else {
            return null; // Department does not exist in the database
        }

    }

    async get(field, value) {
        const [rows, fields] = await this.sql.getEntry(
            this.table, 
            field, 
            value
        );
        return rows;
    }
}