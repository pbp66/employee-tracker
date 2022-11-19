import mysql from "mysql2/promise";

export default class SQL {
    constructor(connection, query, values) {
        this.validateInputs(connection, query, values);
    }

    async newQuery(query, values) {
        this.validateInputs(this.connection, query, values);
        return await this.execute();
    }

    validateInputs(connection, query, values) {
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
        return await this.sql.execute(this.query, values);
    }
}