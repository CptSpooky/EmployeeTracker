const Database = require("./Database");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const database = new Database();
console.log("test");

// add Department function
function addDepaMenu () {
   inquirer.prompt([
      {
         type: "input",
         name: "name",
         message: "Please enter department name"
      }
   ])
      .then(function(answer) {
         database.addDepartment(answer.name, (err, res) => {
            if (err){
               console.log(err);
            }
            menu();
         });
      });
}

// 
function addEmpMenu() {
   let p1 = database.getRoles();
   let p2 = database.getEmployees();
   Promise.all([p1, p2]).then(values => addEmpPrompt(null, values[0], values[1]));

}

// gets specific employee id from updateEmp, gets roles and employees from database and sends id to addEmpPrompt so user can change properties of specific employee
function updEmp(id) {
   let p1 = database.getRoles();
   let p2 = database.getEmployees();
   Promise.all([p1, p2]).then(values => addEmpPrompt(id, values[0], values[1]));

}

// add Employee function
function addEmpPrompt (id, roleList, empList) {

   let roles = [];
   let managers = [];

   roles.push({value: null, name: "No Roll"});

   roleList.forEach(row => {
      roles.push({ value: parseInt(row.id), name: row.title });
   });

   managers.push({value: null, name: "No Manager"});

   empList.forEach(row => {
      managers.push({ value: parseInt(row.id), name: row.first_name + " " + row.last_name });
   });


   inquirer.prompt([
      {
         type: "input",
         name: "firstName",
         message: "What is the employee's first name?"
      },
      {
         type: "input",
         name: "lastName",
         message: "What is the employee's last name?"
      },
      {
         type: "list",
         name: "role",
         message: "What is the employee's role?",
         choices: roles
      },
      {
         type: "list",
         name: "managerID",
         message: "Who is the employee's manager?",
         choices: managers
      }
   
   ])
      .then(function(answer) {
         if (id == null){
            database.addEmployee(answer.firstName, answer.lastName, answer.role, answer.managerID, (err, res) => {
               menu();
            });
         } else {
            database.updateEmployee(id, answer.firstName, answer.lastName, answer.role, answer.managerID, (err, res) => {
               menu();
            });
          }
      });
   
}

// get list for the updateEmp function
function updateEmpMenu(){
   database.getEmployees().then(updateEmp);
}

// Update employee
function updateEmp(empList){
   let employees = [];
   empList.forEach(row => {
      employees.push({ value: row.id, name: row.first_name + " " + row.last_name });
   });

   inquirer.prompt([
      {
         type: "list",
         name: "update",
         message: "Which employee would you like to update?",
         choices: employees
      } 
   ])
      .then(function(answer) {
         updEmp(answer.update);
      });

}

// get roles list from database
function addRolesMenu(){
   database.getDepartments().then(addRolesPrompt);
}

 // add Roles function with list from addRoles
 function addRolesPrompt (depList) {
   let deps = [];

   depList.forEach(row => {
      deps.push({ value: row.id, name: row.name });
   });

   inquirer.prompt([
      {
         type: "input",
         name: "title",
         message: "What role would you like to add?"
      },
      {
         type: "input",
         name: "salary",
         message: "Please enter the salary"
      },
      {
         type: "list",
         name: "department",
         message: "Please select the department",
         choices: deps
      }
   ])
      .then(function(answer) {
         database.addRole(answer.title, answer.salary, answer.department, (err, res) => {
            if (err){
               console.log(err);
            }
            menu();
         });
      });
 }

// view Departments function, gets list of departments
function viewDepaMenu () {
   database.getDepartments().then( list => {
      console.table("Departments", list);
      menu();
   });
}

// view Employees function, gets full list of employees
function viewEmpMenu () {
   database.getEmployeesFull().then( list => {
      console.table("Employees", list);
      menu();
   });
}

// view Roles function, gets list of roles
function viewRolesMenu () {
   database.getRoles().then( list => {
      console.table("Roles", list);
      menu();
   });
}
  
// Questions and main function
function menu (){
   inquirer.prompt([
      {
      type: "list",
      name: "selection",
      message: "What do you want to do?",
      choices: [
         {value: 1, name: "Add department"},
         {value: 2, name: "Add employee"},
         {value: 3, name: "Add role"},
         {value: 4, name: "View departments"},
         {value: 5, name: "View employees"},
         {value: 6, name: "View roles"},
         {value: 7, name: "Update employee"},
         {value: 8, name: "Exit"}
      ]
   }])
      .then(function(answer) {
         switch (answer.selection) {
            case 1: addDepaMenu(); break;
            case 2: addEmpMenu(); break;
            case 3: addRolesMenu(); break;
            case 4: viewDepaMenu(); break;
            case 5: viewEmpMenu(); break;
            case 6: viewRolesMenu(); break;
            case 7: updateEmpMenu(); break;
            case 8: exit(); break;
            }
      });
}

//start program
menu();

// exit
function exit(){
   database.close();
}