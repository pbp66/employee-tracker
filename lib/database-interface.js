import mysql from "mysql2/promise";

export default class DatabaseInterface {
    sql = null;
    query = "";
    values = [];

    constructor(connection, query, values) {
        this.validateInputs(connection, query, values);
    }

    getConnection() {
        return this.sql;
    }

    setConnection(conn) {
        this.validateInputs(conn, this.query, this.values);
    }

    async newQuery(query, values) {
        this.validateInputs(this.connection, query, values);
        return await this.execute();
    }

    validateInputs(connection, query = "", values = []) {
        if ((connection instanceof mysql.Connection) && (query instanceof String) && (values instanceof Array)) {
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
            response = await this.sql.execute(this.query);
        } else {
            response = await this.sql.execute(this.query, this.values);
        }
        return response;
    }

    async close() {
        await this.sql.end();
        return true;
    }

    async getEntry(table, field, value) {
        const response = await this.sql.newQuery(
            'SELECT * FROM ?? WHERE ? = ?', 
            [table, field, value]
        );
        return response;
    }

    async updateEntry(table, field, value, conditionField, conditionValue) {
        const response = await this.sql.newQuery(
            'UPDATE ?? SET ? = ? WHERE ? = ?',
            [table, field, value, conditionField, conditionValue]
        );
        return response;
    }

    async deleteEntry(table, conditionField, conditionValue) {
        const response = await this.sql.newQuery(
            'DELETE FROM ?? WHERE ? = ?',
            [table, conditionField, conditionValue]
        );
        return response;
    }
}