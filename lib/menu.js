import DI from "./interfaces/department-interface.js";
import RI from "./interfaces/role-interface.js";
import EI from "./interfaces/employee-interface.js";
import * as cTable from "console.table";
import Prompt from "./prompts/prompt.js";
import Question from "./prompts/question.js";

export default class Menu {

    constructor() {
        this.deptConn = null;
        this.roleConn = null;
        this.employeeConn = null;
        this.startPrompt = null;
        this.departmentPrompt = null;
        this.rolePrompt = null;
        this.employeePrompt = null;
        this.viewDataPrompt = null;
    }

    async initialize(conn) {
        this.sql = conn;
        this.deptConn = new DI(conn);
        await this.deptConn.initialize();
        this.roleConn = new RI(conn);
        await this.roleConn.initialize();
        this.employeeConn = new EI(conn);
        await this.employeeConn.initialize();

        const departmentChoices = [
            {
                name: "Add A Department",
                value: 'add'
            },
            {
                name: "Delete A Department",
                value: 'delete'
            },
            {
                name: "View Department Budget",
                value: 'view budget'
            },
            {
                name: "View All Departments",
                value: 'view all'
            },
            {
                name: "Retrieve Department Information",
                value: 'get'
            }
        ];

        this.departmentPrompt = new Prompt(
            new Question(
                "Department Options:",
                "Department Prompt",
                "list",
                0,
                departmentChoices
            )
        );    

        const roleChoices = [
            {
                name: "Add a Role",
                value: 'add'
            },
            {
                name: "Retrieve Role Salary",
                value: 'get salary'
            },
            {
                name: "Retrieve Role Department",
                value: 'get department'
            },
            {
                name: "Retrieve Role Information",
                value: 'get'
            },
            {
                name: "Update a Role",
                value: 'update'
            },
            {
                name: "Delete a Role",
                value: 'delete'
            },
            {
                name: "View All Roles",
                value: 'view all'
            }
        ];

        this.rolePrompt = new Prompt(
            new Question(
                "Role Options:",
                "Role Prompt",
                "list",
                0,
                roleChoices
            )
        );

        const employeeChoices = [
            {
                name: "Add an Employee",
                value: 'add'
            },
            {
                name: "Retrieve Employee Manager",
                value: 'get manager'
            },
            {
                name: "Retrieve All Employee Information",
                value: 'get'
            },
            {
                name: "Retrieve Employee Role",
                value: 'get role'
            },
            {
                name: "Update an Employee",
                value: 'update'
            },
            {
                name: "Delete an Employee",
                value: 'delete'
            },
            {
                name: "View Employees By Department",
                value: 'view department'
            },
            {
                name: "View Employees By Manager",
                value: 'view manager'
            },
            {
                name: "View All Employees",
                value: 'view all'
            }
        ];

        this.employeePrompt = new Prompt(
            new Question(
                "Employee Options:",
                "Employee Prompt",
                "list",
                0,
                employeeChoices
            )
        );

        const viewDataChoices = [
            {
                name: "View Department Budget",
                value: 'view budget'
            },
            {
                name: "View All Departments",
                value: 'departments'
            },
            {
                name: "View All Roles",
                value: 'roles'
            },
            {
                name: "View Employees By Department",
                value: 'view department'
            },
            {
                name: "View Employees By Manager",
                value: 'view manager'
            },
            {
                name: "View All Employees",
                value: 'employees'
            }
        ];

        this.viewDataPrompt = new Prompt(
            new Question(
                "Data Viewing Options:",
                "View Data Prompt",
                "list",
                0,
                viewDataChoices
            )
        );

        const startChoices = [
            {
                name: "Add, Update, or View Departments",
                value: "department"
            },
            {
                name: "Add, Update, or View Roles",
                value: "role"
            },
            {
                name: "Add, Update, or View Employees",
                value: "employee"
            },
            {
                name: "View Table Data",
                value: "view data"
            },
            {
                name: "Exit Program",
                value: "exit"
            }
        ];

        this.startPrompt = new Prompt(
            new Question(
                "What Would You Like to Do?",
                "Start Menu",
                "list",
                0,
                startChoices
            )
        );

        return;
    }

    async start() {
        console.log("\n Menu Starting...\n");
        let response = "";
        let userRequest;
        while (response !== "exit") {
            response = Object.values(await this.startPrompt.ask())[0];
            userRequest = await this.menuSelection(response);
            if (userRequest != null) {
                console.table(userRequest);
            }
        }
        return;
    }

    async menuSelection(selection) {
        console.log('');
        switch(selection) {
            case("department"):
                return await this.departmentPrompts();
            case("role"):
                return await this.rolePrompts();
            case("employee"):
                return await this.employeePrompts();
            case("view data"):
                return await this.viewDataPrompts();
            default:
                return null;
        }
    }

     async departmentPrompts() {
        console.log('');
        let response = Object.values(await this.departmentPrompt.ask())[0];
        const interfaceObj = this.deptConn;
        switch(response) {
            case('view all'):
                return await this.deptConn.viewAllDepartments();
            default:
                return await this.getUserInput(interfaceObj);
        }
    }

     async rolePrompts() {
        console.log('');
        let response = Object.values(await this.rolePrompt.ask())[0];
        const interfaceObj = this.roleConn;
        const responseArray = response.split(" ");
        if (responseArray.length > 1) {
            response = response[0];
        }
        switch(response) {
            case('view'):
                return await this.roleConn.viewAllRoles();
            default:
                return await this.getUserInput(interfaceObj, response);
        }
    }

     async employeePrompts() {
        console.log('');
        let response = Object.values(await this.employeePrompt.ask())[0];
        if (responseArray.length > 1) {
            method = response[0];
        }
        switch(method) {
            case('view'):
                switch (response) {
                    case('view all'):
                        return await this.employeeConn.viewAllEmployees();
                    case('view manager'):
                        return await this.employeeConn.viewEmployeesByManager();
                    case('view department'):
                        return await this.employeeConn.viewEmployeesByDepartment();
                }
            default:
                return await this.getUserInput(interfaceObj, response);
        }
    }

     async viewDataPrompts() {
        console.log('');
        let response = Object.values(await this.viewDataPrompt.ask())[0];
        console.log('');
        switch(response) {
            case("view budget"):
                return await this.getUserInput(this.deptConn);
            case("departments"):
                return await this.deptConn.viewAllDepartments();
            case("roles"):
                return await this.roleConn.viewAllRoles();
            case('view manager'):
                return await this.employeeConn.viewEmployeesByManager();
            case('view department'):
                return await this.employeeConn.viewEmployeesByDepartment();
            case('employees'):
                return await this.employeeConn.viewAllEmployees();
        }
    }

    async getUserInput(interfaceObj, method, property = null) {
        let inputPrompt = await this.#generateUserPrompt(
            interfaceObj, 
            method, 
            property
        );

        let response = Object.values(await inputPrompt.ask());
        console.log(response);
        switch(method) {
            case('add'):
                return await this.interfaceObj.add(response[0]);
            case('delete'):
                return await this.interfaceObj.delete(response[0]);
            case('get'):
                switch(interfaceObj.table) {
                    case('departments'):
                        break;
                    default:
                        return null;
                }
            case('update'):
                switch(interfaceObj.table) {
                    case('departments'):
                        break;
                    default:
                        return null;
                }
        }
    }

    async updateRole() {
        // switch case or if statements to call the correct update method with the role interface class
        // Function to prompt for role title, then subPrompt the information to Update in another function/prompt
    }

    async updateEmployee() {
        // Prompt for employee name and information to change. Then, use this function to select the right method within the employee interface class
    }

    async endSession() {
        console.log("Closing connections to the database...");
        await this.deptConn.close(); // Closes all active connections for each interface since they use the same login
        console.log("Exiting Program...\n");
        return null;
    }

    async #generateUserPrompt(interfaceObj, method = ''){
        let questions = [];
        switch(interfaceObj.table) {
            case('departments'):
                questions.push(new Question(
                    "Please enter the department name:",
                    "Department Name",
                    'input'
                ));
                break;
            case('roles'):
                switch(method) {
                    case('add'):
                        questions.push(new Question(
                            "Please enter the role's title:",
                            'Role Title',
                            'input'
                        ));
                        questions.push(new Question(
                            "Please enter the role's salary:",
                            'Role Salary',
                            'input'
                        ));
                        questions.push(new Question(
                            "Please enter the role's department:",
                            'Role Department',
                            'input'
                        ));
                        break;
                    case('get'):
                        questions.push(new Question(
                            "Select Role:",
                            "Role Title",
                            'list',
                            0,
                            await this.interfaceObj.getAllTitles()
                        ));
                        questions.push(new Question(
                            'Select the Attribute to Retrieve:',
                            'Attribute Selection',
                            'list',
                            0,
                            ['Title', 'Salary', 'Department', 'All Attributes']
                        ));
                        break;
                    case('update'):
                        questions.push(new Question(
                            'Select the role to update:',
                            'Update Role',
                            'list',
                            0,
                            await this.interfaceObj.getAllTitles()
                        ));
                            questions.push(new Question(
                            "Select the Attribute to Update:",
                            'Update Attribute',
                            'list',
                            0,
                            ['Title', 'Salary', 'Department']
                        ));
                        questions.push(new Question(
                            "What is the new value?",
                            'Update Value',
                            'input'
                        ));
                        break;
                    case('delete'):
                        questions.push(new Question(
                            'Select the role to delete:',
                            'Delete Role',
                            'list',
                            0,
                            await this.interfaceObj.getAllTitles()
                        ));
                        break;
                }
                break;
            case('employees'):
                switch(method) {
                    case('add'):
                        questions.push(new Question(
                            "Enter the employee's name:",
                            'Employee Name',
                            'input'
                        ));
                        questions.push(new Question(
                            "Select the employee's role:",
                            'Employee Role',
                            'list',
                            0,
                            await this.roleConn.getAllTitles()
                        ));
                        questions.push(new Question(
                            "Enter the employee's manager:",
                            'Employee Manager',
                            'list',
                            0,
                            await this.interfaceObj.getAllEmployeeNames()
                        ));
                        break;
                    case('get'):
                        questions.push(new Question(
                            "Select Employee:",
                            "Employee Name",
                            'list',
                            0,
                            await this.interfaceObj.getAllEmployeeNames()
                        ));
                        questions.push(new Question(
                            'Select the Attribute to Retrieve:',
                            'Attribute Selection',
                            'list',
                            0,
                            [
                                'Full Name', 
                                'First Name', 
                                'Last Name', 
                                'Role', 
                                'Manager'
                            ]
                        ));
                        break;
                    case('update'):
                        questions.push(new Question(
                            "Select Employee to Update:",
                            "Employee Name",
                            'list',
                            0,
                            await this.interfaceObj.getAllEmployeeNames()
                        ));
                        questions.push(new Question(
                            'Select the Attribute to Update:',
                            'Attribute Selection',
                            'list',
                            0,
                            [
                                'Full Name', 
                                'First Name', 
                                'Last Name', 
                                'Role', 
                                'Manager'
                            ]
                        ));
                        questions.push(new Question(
                            "What is the new value?",
                            'Update Value',
                            'input'
                        ));
                        break;
                    case('delete'):
                        questions.push(new Question(
                            'Select the employee to delete:',
                            'Delete Employee',
                            'list',
                            0,
                            await this.interfaceObj.getAllEmployeeNames()
                        ));
                        break;
                }
                break;
            default:
                return null;
        }
        return new Prompt(questions);
    }
}