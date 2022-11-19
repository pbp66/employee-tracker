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
const result = await test.addRole('Accounting Admin', 60000, 'Accounting');
console.log(result);