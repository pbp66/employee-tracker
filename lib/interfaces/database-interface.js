import { PromiseConnection } from "mysql2/promise";

export default class DatabaseInterface {
    sql = null;
    query = "";
    values = [];

    constructor(conn) {
        this.createConnection(conn);
    }

    createConnection(conn) {
        this.setConnection(conn);
    }

    getConnection() {
        return this.sql;
    }

    setConnection(conn) {
        this.validateInputs(conn, this.query, this.values);
    }

    async newQuery(query, values) {
        this.validateInputs(this.sql, query, values);
        return await this.execute();
    }

    validateInputs(connection, query = "", values = []) {
        if (
            (connection instanceof PromiseConnection) && 
            (typeof query === "string") && 
            (values instanceof Array)
        ) {
            this.sql = connection;
            this.query = query;
            this.values = values;
            return;
        } else {
            throw new TypeError("Incorrect constructor type(s)");
        }
    }

    async execute() {
        let response;
        if (this.values.length === 0) {
            response = await this.sql.query(this.query);
        } else {
            response = await this.sql.query(this.query, this.values);
        }
        return response;
    }

    async close() {
        await this.sql.end();
        return true;
    }

    async createEntries(table, fieldList = [], values = []) {
        let cols = ""//, vals = "";
        for (let i = 0; i < fieldList.length; i++) {
            cols += "?,";
            //vals += "?,";
        }
        cols = cols.slice(0, cols.length - 1);
        //vals = vals.slice(0, vals.length - 1);

        const query = "INSERT INTO ? (" + cols + ") VALUES (" + cols + ");";
        const newValues = [table, ...fieldList, ...values];
        const [rows, fields] = await this.newQuery(query, newValues);
        return rows;
    }

    async getEntry(table, field, value) {
        const [rows, fields] = await this.newQuery(
            "SELECT * FROM ?? WHERE ?? = ?", 
            [table, field, value]
        );
        return rows;
    }

    async getAllEntries(table) {
        const [rows, fields] = await this.newQuery(
            "SELECT * FROM ??",
            [table]
        );
        return rows;
    }

    async updateEntry(table, field, value, conditionField, conditionValue) {
        const [rows, fields] = await this.newQuery(
            "UPDATE ?? SET ? = ? WHERE ?? = ?",
            [table, field, value, conditionField, conditionValue]
        );
        return rows;
    }

    async deleteEntry(table, conditionField, conditionValue) {
        await this.newQuery(
            "DELETE FROM ?? WHERE ?? = ?",
            [table, conditionField, conditionValue]
        );
        return true;
    }
}