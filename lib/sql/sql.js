import mysql from "mysql2/promise";

export default class SQL {
    constructor(connection, query, values) {
        if (this.validateInputs(connection, query, values)) {
            this.sql = connection;
            this.query = query;
            this.values = values;
        } else {
            throw new TypeError("Incorrect constructor type(s)");
        }
    }

    validateInputs(connection, query, values) {
        return (connection instanceof mysql.Connection) && (query instanceof String) && (values instanceof Array);
    }

    async execute() {
        this.sql.execute(this.query, values)
    }
}