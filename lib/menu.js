import Company from "./company/company";

export default class Menu {
    constructor(connection, ) {
        this.company = new Company(connection);
    }
}