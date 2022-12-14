import mysql from "mysql2/promise";
import Menu from "./lib/menu.js";

async function main() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'james',
        password: '',
        database: 'employees'
    });

    const employeeDatabase = new Menu();
    await employeeDatabase.initialize(connection);
    await employeeDatabase.start();
    await employeeDatabase.endSession();
}

await main();