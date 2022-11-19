import mysql from "mysql2/promise";
import Menu from "./lib/menu.js";
import Company from "./lib/company/company.js";
import cTable from "console.table";

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

    const test = new Company(connection);
    console.table(await test.viewAllEmployees());
    console.log(cTable.getTable(await test.viewAllDepartments()));
    console.table(await test.viewAllRoles());
}

await main();