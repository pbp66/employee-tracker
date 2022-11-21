import { DepartmentInterface as DI } from "./interfaces/department-interface.js";
import { RoleInterface as RI } from "./interfaces/role-interface.js";
import { EmployeeInterface as EI } from "./interfaces/employee-interface.js";
import { console.table as cTable } from "console.table";

export default class Menu {
    constructor() {
        this.deptConn = null;
        this.roleConn = null;
        this.employeeConn = null;

    }

    async initialize(conn) {
        this.deptConn = new DI(conn);
        await this.deptConn.initialize();
        this.roleConn = new RI(conn);
        await this.roleConn.initialize();
        this.employeeConn = new EI(conn);
        await this.employeeConn.initialize();
    }

    async endSession() {
        return await this.sql.close();
    }
}