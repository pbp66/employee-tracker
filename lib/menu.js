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

        const departmentChoices = [
            {
                name: "Add A Department",
                value: this.departmentPrompt("add")
            },
            {
                name: "Delete A Department",
                value: this.departmentPrompt("delete")
            },
            {
                name: "View Department Budget",
                value: this.departmentPrompt("view budget")
            },
            {
                name: "View All Departments",
                value: this.deptConn.viewAllDepartments()
            },
            {
                name: "Retrieve Department Information",
                value: this.departmentPrompt("get")
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
                value: this.rolePrompts("add")
            },
            {
                name: "Retrieve Role Salary",
                value: this.rolePrompts("get salary")
            },
            {
                name: "Retrieve Role Department",
                value: this.rolePrompts("get department")
            },
            {
                name: "Retrieve Role Information",
                value: this.rolePrompts("get")
            },
            {
                name: "Update a Role",
                value: this.updateRole()
            },
            {
                name: "Delete a Role",
                value: this.rolePrompts("delete") // Function to prompt for role title then delete it
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
                value: this.employeePrompts("add")
            },
            {
                name: "Retrieve Employee Manager",
                value: this.employeePrompts("get manager")
            },
            {
                name: "Retrieve All Employee Information",
                value: this.employeePrompts("get")
            },
            {
                name: "Retrieve Employee Role",
                value: this.employeePrompts("get role")
            },
            {
                name: "Update an Employee",
                value: this.updateEmployee()
            },
            {
                name: "Delete an Employee",
                value: this.employeePrompts("delete")
            },
            {
                name: "View Employees By Department",
                value: this.employeeConn.viewEmployeesByDepartment()
            },
            {
                name: "View Employees By Manager",
                value: this.employeeConn.viewEmployeesByManager()
            },
            {
                name: "View All Employees",
                value: this.employeeConn.viewAllEmployees()
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
                value: this.departmentPrompts("view budget")
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
                value: this.employeeConn.viewEmployeesByDepartment()
            },
            {
                name: "View Employees By Manager",
                value: this.employeeConn.viewEmployeesByManager()
            },
            {
                name: "View All Employees",
                value: this.employeeConn.viewAllEmployees()
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
            case("add"): // Add
                break;
            case("delete"): // Delete
                break;
            case("view budget"): // View Budget
                break;
            case("get"): // View All
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