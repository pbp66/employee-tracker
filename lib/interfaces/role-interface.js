import Department from "./department.js";

export default class Role {
    constructor(name, salary, department) {
        this.title = name;
        this.salary = salary;
        if (department == null || department instanceof Department) {
            this.department = department;
        } else {
            this.department = new Department(department);
        }
        this.id = null;
    }
}