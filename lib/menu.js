import { DepartmentInterface as DI } from "./interfaces/department-interface.js";
import { RoleInterface as RI } from "./interfaces/role-interface.js";
import { EmployeeInterface as EI } from "./interfaces/employee-interface.js";
import { console.table as cTable } from "console.table";
import Prompt from "./prompts/prompt.js";
import Question from "./prompts/question.js";

export default class Menu {
    startPrompt = null;
    departmentPrompt = null;
    rolePrompt = null;
    employeePrompt = null;
    viewDataPrompt = null;

    constructor() {
        this.deptConn = null;
        this.roleConn = null;
        this.employeeConn = null;
    }

    async initialize(conn) {
        this.deptConn = new DI(conn);
        await this.deptConn.initialize();
        this.roleConn = new RI(conn);
        await this.roleConn.initialize();
        this.employeeConn = new EI(conn);
        await this.employeeConn.initialize();

        const startChoices = [
            {
                name: "Add, Update, or View Departments",
                value: this.departmentPrompts()
            },
            {
                name: "Add, Update, or View Roles",
                value: this.rolePrompts()
            },
            {
                name: "Add, Update, or View Employees",
                value: this.employeePrompts()
            },
            {
                name: "View Table Data",
                value: this.viewDataPrompts()
            },
            {
                name: "Exit Program",
                value: this.endSession()
            },
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

        const departmentChoices = [
            {
                name: "Add A Department",
                value: // Function to prompt for department name, then add department
            },
            {
                name: "Delete A Department",
                value: // Function to prompt for department name, then delete department
            },
            {
                name: "View Department Budget",
                value: // Function to prompt for department name, then view department budget
            },
            {
                name: "View All Departments",
                value: this.deptConn.viewAllDepartments()
            },
            {
                name: "Retrieve Department Information",
                value: // Function to prompt for department name, then view department budget
            }
        ];

        this.departmentPrompt = new Prompt(
            new Question(
                "What Would You Like to Do?",
                "Department Prompt",
                "list",
                0,
                departmentChoices
            )
        );

        const roleChoices = [
            {
                name: "Add a Role",
                value: // Function to prompt for role title, salary, and department name, then add role
            },
            {
                name: "Retrieve Role Salary",
                value: // Function to prompt for role title then display its salary
            },
            {
                name: "Retrieve Role Department",
                value: // Function to prompt for role title then display its department
            },
            {
                name: "Retrieve Role Information",
                value: // Function to prompt for role title then display all role values
            },
            {
                name: "Update a Role",
                value: this.updateRole()
            },
            {
                name: "Delete a Role",
                value: // Function to prompt for role title then delete it
            },
            {
                name: "View All Roles",
                value: this.roleConn.viewAllRoles()
            }
        ];

        this.rolePrompt = new Prompt(
            new Question(
                "What Would You Like to Do?",
                "Role Prompt",
                "list",
                0,
                roleChoices
            )
        );

        const employeeChoices = [
            {
                name: "Add an Employee",
                value: // Function to prompt for employee name, role, and manager
            },
            {
                name: "Retrieve Employee Manager",
                value: // Function to prompt for employee name and retrieve their manager
            },
            {
                name: "Retrieve All Employee Information",
                value: // Function to prompt for employee name and retrieve all data
            },
            {
                name: "Retrieve Employee Role",
                value: // Function to prompt for employee name, then retrieve its role
            },
            {
                name: "Update an Employee",
                value: this.updateEmployee()
            },
            {
                name: "Delete an Employee",
                value:
            },
            {
                name: "View Employees By Department",
                value: // Function to prompt for employee name, role, and manager
            },
            {
                name: "View Employees By Manager",
                value: // Function to prompt for employee name, role, and manager
            },
            {
                name: "View All Employees",
                value: // Function to prompt for employee name, role, and manager
            }
        ];

        this.employeePrompt = new Prompt(
            new Question(
                "What Would You Like to Do?",
                "Employee Prompt",
                "list",
                0,
                employeeChoices
            )
        );

        const viewDataChoices = [
            {
                name: "View Department Budget",
                value: // Function to prompt for department name, then view department budget
            },
            {
                name: "View All Departments",
                value: this.deptConn.viewAllDepartments()
            },
            {
                name: "View All Roles",
                value: this.roleConn.viewAllRoles()
            },
            {
                name: "View Employees By Department",
                value: // Function to prompt for employee name, role, and manager
            },
            {
                name: "View Employees By Manager",
                value: // Function to prompt for employee name, role, and manager
            },
            {
                name: "View All Employees",
                value: // Function to prompt for employee name, role, and manager
            }
        ];

        this.viewDataPrompt = new Prompt(
            new Question(
                "What Would You Like to Do?",
                "View Data Prompt",
                "list",
                0,
                viewDataChoices
            )
        );

        return;
    }

    async start() {
        await this.startPrompt.ask();
    }

    async departmentPrompts(selection) {
        switch(selection) {
            case(1): // Add
                break;
            case(2): // Delete
                break;
            case(3): // View Budget
                break;
            case(4): // View All
                break;
            case(5): // View one department
                break;
            default:
        }
    }

    async rolePrompts(selection) {
        switch(selection) {
            case(1): // Add
                break;
            case(2): // Delete
                break;
            case(3): // View Budget
                break;
            case(4): // View All
                break;
            case(5): // View one department
                break;
            case(6): // View one department
                break;
            case(7): // View one department
                break;
            default:
        }
    }

    async employeePrompts(selection) {
        switch(selection) {
            case(1): // Add
                break;
            case(2): // Delete
                break;
            case(3): // View Budget
                break;
            case(4): // View All
                break;
            case(5): // View one department
                break;
            default:
        }
    }

    async viewDataPrompts(selection) {
        switch(selection) {
            case(1): // Add
                break;
            case(2): // Delete
                break;
            case(3): // View Budget
                break;
            case(4): // View All
                break;
            case(5): // View one department
                break;
            default:
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
        console.log("\n Exiting Program...\n");
        await this.deptConn.close();
        await this.roleConn.close();
        await this.employeeConn.close();
        return;
    }
}