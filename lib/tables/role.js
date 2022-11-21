export default class Role {
    constructor(name, salary, department, id = null) {
        this.title = name;
        this.salary = salary;
        this.department = department;
        this.id = id;
    }
}