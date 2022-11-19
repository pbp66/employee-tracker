import Menu from "./lib/menu.js";
import Company from "./lib/company/company.js";
import cTable from "console.table";

function init() {

}

function main() {

}

init();

main();

// DEV Testing Section
const test = new Company();
console.table(await test.getAllEmployees());
console.log(cTable.getTable(await test.getAllDepartments()));
console.table(await test.getAllRoles());
//console.log(result2);