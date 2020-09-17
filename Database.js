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

    // end connection
    close() {
        this.connection.end();
    }

    // add department into table
    addDepartment(name, cb) {
        const query = "INSERT INTO employee_tracker.department (name) VALUES (?);";
        this.connection.query(query, [name], cb);
    }

    // add employee into table
    addEmployee(firstName, lastName, role, manager, cb) {
        const query = "INSERT INTO employee_tracker.employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);";
        this.connection.query(query, [firstName, lastName, role, manager], cb);
    }

    // add role into table
    addRole(title, salary, depID, cb) {
        const query = "INSERT INTO employee_tracker.role (title, salary, department_id) VALUES (?, ?, ?);";
        this.connection.query(query, [title, salary, depID], cb);
    }

    // get roles for choices/view
    getRoles(){
        const query = "SELECT id, title FROM employee_tracker.role;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

    // get employee for choices
    getEmployees(){
        const query = "SELECT id, first_name, last_name FROM employee_tracker.employee;";
        
        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {
                resolve(res);
            });    
        });

        return promise;
    }

    // get full list of employees with tables joined to display
    getEmployeesFull(){
        
        const query =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as 'department', employee.manager_id as 'manager'" +
        "FROM employee_tracker.employee " +
        "LEFT JOIN role ON (employee.role_id = role.id) " +
        "LEFT JOIN department ON (department.id = role.department_id);";

        let promise = new Promise((resolve, reject) => {
            this.connection.query(query, (err, res) => {

                // get manager name on table
                res.forEach(row => {
                    let managerId = row.manager;
                    let managerName = "nobody";
                    //console.log(managerId);
                    for (let i = 0; i < res.length; i++){
                        if(res[i].id == managerId){
                            managerName = res[i].first_name + " " + res[i].last_name;
                            break;
                        }
                    }
                    row.manager = managerName;
                });

                resolve(res);
            });    
        });

        return promise;
    }


    //update employees
    updateEmployee(id, firstName, lastName, role, manager, cb){
        const query = "UPDATE employee_tracker.employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE (id = ?)";
        this.connection.query(query, [firstName, lastName, role, manager, id], cb);    
    }


    //get departments
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