import mysql from "mysql2/promise";
import Menu from "./lib/menu.js";

function init() {

}

async function main() {
    init();
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'james',
        password: '',
        database: 'employees'
    });

    const employeeDatabase = new Menu(connection);
    await employeeDatabase.start();
    await employeeDatabase.company.endSession();
}

main();