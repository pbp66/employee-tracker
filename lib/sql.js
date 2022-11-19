import mysql from "mysql2/promises";

export default class SQL {
    constructor(hostAddress, username, password, database) {
        this.connection = mysql.createConnection({
            host: hostAddress,
            user: username,
            password: password,
            database: database
        });
    }
}