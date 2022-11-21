import { DatabaseInterface as DBI } from "../database-interface.js";

export default class Company {
    #departments = [];
    #roles = [];
    #employees = [];

    constructor(connection) {
        this.sql = new DBI(connection);
    }



