import mysql from "mysql2/promise";

export default class SQL {
    sql;
    query;
    values;

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

    async getMatchingEntry(table, field, value) {
        const response = await (await this.sql).newQuery(
            'SELECT * FROM ?? WHERE ? = ?', 
            [table, field, value]
        );
        return response;
    }
}