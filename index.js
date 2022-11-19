import Menu from "./lib/menu.js";
import Company from "./lib/company/company.js";

function init() {

}

function main() {

}

init();

main();

// DEV Testing Section
const test = new Company();
//const result = await test.addDepartment("Test");
const result1 = await test.addEmployee('Abraham Lincoln', 'Operations Manager', null);
const result2 = await test.addEmployee('Adam Seist', 'Production Engineer', 'Abraham Lincoln');
console.log(result1);
console.log(result2);