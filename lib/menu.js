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
                name: "Retrieve Employee Information",
                value: 'get'
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
        switch(response) {
            case('view all'):
                return await this.deptConn.viewAllDepartments();
            case('view budget'):
                return await this.getUserInput(this.deptConn, 'view budget');
            case('add'):
                return await this.getUserInput(this.deptConn, 'add');
            default:
                return await this.getUserInput(this.deptConn, response);
        }
    }

     async rolePrompts() {
        console.log('');
        let response = Object.values(await this.rolePrompt.ask())[0];
        const responseArray = response.split(" ");
        if (responseArray.length > 1) {
            response = responseArray[0];
        }
        switch(response) {
            case('view'):
                return await this.roleConn.viewAllRoles();
            default:
                return await this.getUserInput(this.roleConn, response);
        }
    }

     async employeePrompts() {
        console.log('');
        let response = Object.values(await this.employeePrompt.ask())[0];
        switch(response) {
            case('view all'):
                return await this.employeeConn.viewAllEmployees();
            case('view manager'):
                return await this.getUserInput(
                    this.employeeConn, 
                    'view manager'
                );
            case('view department'):
                return await this.getUserInput(
                    this.employeeConn, 
                    'view department'
                );
            default:
                return await this.getUserInput(this.employeeConn, response);
        }
    }

     async viewDataPrompts() {
        console.log('');
        let response = Object.values(await this.viewDataPrompt.ask())[0];
        console.log('');
        switch(response) {
            case("view budget"):
                return await this.getUserInput(this.deptConn, "view budget");
            case("departments"):
                return await this.deptConn.viewAllDepartments();
            case("roles"):
                return await this.roleConn.viewAllRoles();
            case('view manager'):
                return await this.getUserInput(
                    this.employeeConn, 
                    'view manager'
                );
            case('view department'):
                return await this.getUserInput(
                    this.employeeConn, 
                    'view department'
                );
            case('employees'):
                return await this.employeeConn.viewAllEmployees();
        }
    }

    async getUserInput(interfaceObj, method) {
        const inputPrompt = await this.#generateUserPrompt(
            interfaceObj, 
            method
        );
        const response = Object.values(await inputPrompt.ask());
        console.log('');
        switch(interfaceObj.table) {
            case('departments'):
                return await this.departmentQuery(method, response);
            case('roles'):
                return await this.roleQuery(method, response);
            case('employees'):
                return await this.employeeQuery(method, response);
            default:
                // Unsure...
        }
    }

    async departmentQuery(method, values) {
        const value = values[0];
        switch(method) {
            case('add'):
                return await this.deptConn.add(value);
            case('get'):
                return await this.deptConn.getDepartment(value);
            case('delete'):
                return await this.deptConn.delete(value);
            case('view budget'):
                return await this.deptConn.viewBudget(value);
        }
    }

    async roleQuery(method, values) {
        switch(method) {
            case('add'):
                return await this.roleConn.add(...values);
            case('get'):
                return await this.roleConn.getRole(values[0]);
            case('delete'):
                return await this.roleConn.delete(values[0]);
            case('update'):
                return await this.roleConn.updateRole(...values);
        }
    }

    async employeeQuery(method, values) {
        switch(method) {
            case('add'):
                return await this.employeeConn.add(...values);
            case('get'):
                return await this.employeeConn.getEmployee(values[0]);
            case('delete'):
                return await this.employeeConn.delete(values[0]);
            case('update'):
                return await this.employeeConn.updateEmployee(...values);
            case('view all'):
                return await this.employeeConn.viewAllEmployees();
            case('view department'):
                return await this.employeeConn.viewEmployeesByDepartment(values[0]);
            case('view manager'):
                return await this.employeeConn.viewEmployeesByManager(values[0]);
        }
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
                switch(method) {
                    case('add'):
                        questions.push(new Question(
                            "Please enter the department name:",
                            "Department Name",
                            'input'
                        ));
                        break;
                    default:
                        questions.push(new Question(
                            "Select the department:",
                            "Department Name",
                            'list',
                            0,
                            await this.deptConn.getAllDepartmentNames()
                        ));
                }
                break;
            case('roles'):
                switch(method) {
                    case('add'):
                        questions.push(new Question(
                            "Enter the role's title:",
                            'Title',
                            'input'
                        ), new Question(
                            "Enter the role's salary:",
                            'Salary',
                            'input'
                        ), new Question(
                            "Select the role's department:",
                            'Department',
                            'list',
                            0,
                            await this.deptConn.getAllDepartmentNames()
                        ));
                        break;
                    case('get'):
                        questions.push(new Question(
                            "Select Role:",
                            "Role Title",
                            'list',
                            0,
                            await this.roleConn.getAllTitles()
                        ));
                        break;
                    case('update'):
                        questions.push(new Question(
                            'Select the role to update:',
                            'Update Role',
                            'list',
                            0,
                            await this.roleConn.getAllTitles()
                        ), new Question(
                            "Select the Attribute to Update:",
                            'Attribute',
                            'list',
                            0,
                            ['Title', 'Salary', 'Department']
                        ),
                        {
                            type: 'input', 
                            name: 'Value', 
                            message: "What is the new value?",
                            when: function( answer ) {
                                return answer['Attribute'] !== 'Department';
                            }
                        }, 
                        {
                            type: 'list', 
                            name: 'Update Department', 
                            message: "Select a New Department",
                            choices: 
                                await this.deptConn.getAllDepartmentNames(),
                            when: function( answer ) {
                                return answer['Attribute'] === 'Department';
                            }
                        });
                        break;
                    case('delete'):
                        questions.push(new Question(
                            'Select the role to delete:',
                            'Delete Role',
                            'list',
                            0,
                            await this.roleConn.getAllTitles()
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
                        ), new Question(
                            "Select the employee's role:",
                            'Employee Role',
                            'list',
                            0,
                            await this.roleConn.getAllTitles()
                        ), new Question(
                            "Enter the employee's manager:",
                            'Employee Manager',
                            'list',
                            0,
                            [
                                ...(await this.employeeConn.getAllEmployeeNames()), 
                                'NULL'
                            ]
                        ));
                        break;
                    case('get'):
                        questions.push(new Question(
                            "Select Employee:",
                            "Employee Name",
                            'list',
                            0,
                            await this.employeeConn.getAllEmployeeNames()
                        ), new Question(
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
                            "Name",
                            'list',
                            0,
                            await this.employeeConn.getAllEmployeeNames()
                        ), new Question(
                            'Select the Attribute to Update:',
                            'Attribute',
                            'list',
                            0,
                            [
                                'Full Name', 
                                'First Name', 
                                'Last Name', 
                                'Role', 
                                'Manager'
                            ]
                        ),
                        {
                            type: 'input', 
                            name: 'Value', 
                            message: "What is the new value?",
                            when: function( answer ) {
                                return !(['Role', 'Manager'].includes(answer['Attribute']));
                            }
                        }, 
                        {
                            type: 'list', 
                            name: 'Role', 
                            message: "Select a New Role",
                            choices: 
                                await this.roleConn.getAllTitles(),
                            when: function( answer ) {
                                return answer['Attribute'] === 'Role';
                            }
                        },
                        {
                            type: 'list', 
                            name: 'Manager', 
                            message: "Select a New Manager",
                            choices: 
                            [
                                ...(await this.employeeConn.getAllEmployeeNames()), 
                                'NULL'
                            ],
                            when: function( answer ) {
                                return answer['Attribute'] === 'Manager';
                            }
                        });
                        break;
                    case('delete'):
                        questions.push(new Question(
                            'Select the employee to delete:',
                            'Delete Employee',
                            'list',
                            0,
                            await this.employeeConn.getAllEmployeeNames()
                        ));
                        break;
                    case('view department'):
                        questions.push(new Question(
                            "Select the department:",
                            "Department Name",
                            'list',
                            0,
                            await this.deptConn.getAllDepartmentNames()
                        ));
                        break;
                    case('view manager'):
                        questions.push(new Question(
                            "Select the manager:",
                            "Manager",
                            'list',
                            0,
                            [
                                ...(await this.employeeConn.getAllEmployeeNames()), 
                                'NULL'
                            ]
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