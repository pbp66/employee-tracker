import Company from "./company/company";
import { console.table as cTable } from "console.table";

export default class Menu {
    constructor(connection, ) {
        this.company = new Company(connection);
    }
}