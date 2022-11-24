export default class Role {
    constructor(name, salary, department, id = null) {
        this.title = name;
        this.salary = salary;
        this.department = department;
        this.id = id;
    }

    view() {
        return {
            title: this.title,
            salary: this.salary,
            department: this.department.name,
            id: this.id
        }
    }
}