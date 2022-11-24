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
            (typeof query === 'string') && 
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
        let columns = '';
        for (let i = 0; i < fieldList.length; i++) {
            columns += '?, ';
        }
        columns = columns.slice(0, columns.length - 2);

        const query = `INSERT INTO ? (${columns}) VALUES (${columns})`;
        values = [table, ...values];

        const [rows, fields] = await this.newQuery(query, values);
        return rows;
    }

    async getEntry(table, field, value) {
        const [rows, fields] = await this.newQuery(
            'SELECT * FROM ?? WHERE ?? = ?', 
            [table, field, value]
        );
        return rows;
    }

    async getAllEntries(table) {
        const [rows, fields] = await this.newQuery(
            'SELECT * FROM ??',
            [table]
        );
        return rows;
    }

    async updateEntry(table, field, value, conditionField, conditionValue) {
        const [rows, fields] = await this.newQuery(
            'UPDATE ?? SET ? = ? WHERE ?? = ?',
            [table, field, value, conditionField, conditionValue]
        );
        return rows;
    }

    async deleteEntry(table, conditionField, conditionValue) {
        const [rows, fields] = await this.newQuery(
            'DELETE FROM ?? WHERE ?? = ?',
            [table, conditionField, conditionValue]
        );
        return rows;
    }
}