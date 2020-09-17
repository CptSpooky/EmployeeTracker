const mysql = require("mysql");

class Database {
    constructor() {
        this.connection = this.connect();
    }

    connect() {
        const connection = mysql.createConnection({
            host: "localhost",
            port: 3306,// Your port; if not 3306
            user: "root", // Your username
            password: "pootndoot",// Your password REMEMBER TO CHANGE
            database: "employee_tracker"
          });
        
        connection.connect(err => {
            if (err) throw err;
            console.log("database connection successful");
        });

        return connection;
    }

    close() {
        this.connection.end();
    }

    addDepartment(name, cb) {
        const query = "INSERT INTO employee_tracker.department (name) VALUES (?);";
        this.connection.query(query, [name], cb);
    }

    addEmployee(firstName, lastName, role, manager, cb) {

        if (manager == 0) {
            manager = null;
        }
        const query = "INSERT INTO employee_tracker.employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);";
        this.connection.query(query, [firstName, lastName, role, manager], cb);
    }

    addRole(title, salary, depID, cb) {
        const query = "INSERT INTO employee_tracker.role (title, salary, department_id) VALUES (?, ?, ?);";
        this.connection.query(query, [title, salary, depID], cb);
    }

    getRoles(){
        const query = "SELECT id, title FROM employee_tracker.role;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

    getEmployees(){
        const query = "SELECT id, first_name, last_name FROM employee_tracker.employee;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

    getEmployeesFull(){
        const query = "SELECT * FROM employee_tracker.employee;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

    getDepartments(){
        const query = "SELECT id, name FROM employee_tracker.department;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

}


module.exports = Database;