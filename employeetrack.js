const Database = require("./Database");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const database = new Database();
console.log("test");

// add Department function
function addDepa () {
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
function addEmp() {
   let p1 = database.getRoles();
   let p2 = database.getEmployees();
   Promise.all([p1, p2]).then(values => addEmpPrompt(values[0], values[1]));

}

// add Employee function
function addEmpPrompt (roleList, empList) {

   let roles = [];
   let managers = [];

   roleList.forEach(row => {
      roles.push({ value: row.id, name: row.title });
   });

   managers.push({value: 0, name: "No Manager"});

   empList.forEach(row => {
      managers.push({ value: row.id, name: row.first_name + " " + row.last_name });
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
         let role = parseInt(answer.role);
         database.addEmployee(answer.firstName, answer.lastName, role, answer.managerID, (err, res) => {
            console.log(res);
            console.log(err);
            menu();
         });
      });
   
}

function addRoles(){
   database.getDepartments().then(addRolesPrompt);
}

 // add Roles function
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

// view Departments function
function viewDepa () {
   database.getDepartments().then( list => {
      console.table("Departments", list);
      menu();
   });
}

// view Employees function
function viewEmp () {
   database.getEmployees().then( list => {
      console.table("Employees", list);
      menu();
   });
}

// view Roles function
function viewRoles () {
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
         {value: 1, name: "Add departments"},
         {value: 2, name: "Add employees"},
         {value: 3, name: "Add roles"},
         {value: 4, name: "View departments"},
         {value: 5, name: "View employees"},
         {value: 6, name: "View roles"},
         {value: 7, name: "Exit"}
      ]
   }])
      .then(function(answer) {
         switch (answer.selection) {
            case 1: addDepa(); break;
            case 2: addEmp(); break;
            case 3: addRoles(); break;
            case 4: viewDepa(); break;
            case 5: viewEmp(); break;
            case 6: viewRoles(); break;
            case 7: exit(); break;
            }
      });
}

//start program
menu();

// exit
function exit(){
   database.close();
}