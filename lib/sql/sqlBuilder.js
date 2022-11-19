export default class SQLBuilder {
    constructor(type, fields, database, constraints) {
        this.type = type.toLowerCase(); // create, read, update, delete
        this.fields = fields;
        this.database = database;
        this.constraints = constraints;

        this.query = {}; // {query: "", values: []};
        buildQuery();
    }

    buildQuery() {
        switch(this.type) {
            case("create"):
                this.query = this.buildCreate();
                break;
            case("read"):
                this.query = this.buildRead();
                break;
            case("update"):
                this.query = this.buildUpdate();
                break;
            case("delete"):
                this.query = this.buildDelete();
                break;
            default:
                throw new TypeError("Wrong SQLBuilder Type specified");
        }
        return this.query;
    }

    buildCreate() {

    }

    buildRead() {

    }

    buildUpdate() {

    }

    buildDelete() {

    }

    // Read
    #select() {
        let select = 'SELECT ';
        for (let i = 0; i < this.fields.length; i++) {
            select += '??, ';
        }
        return select.slice(0, select.length - 2);
    }

    #from() {
        return 'FROM ??';
    }

    // Create
    #insert() {
        let insert = 'INSERT INTO ?? (';
        for (let i  = 0; i < this.fields.length; i++) {
            insert += '??, '
        }
        return insert.slice(0, index.length - 2) + ')';
    }

    // Update
    #update() {
        let update = 'UPDATE ?? ';

    }

    // Delete
    #delete() {

    }

    #where() {

    }

    #values() {

    }

    #join() {

    }
}