const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'Mons@li17',
  database: 'e_tracker',
});

let rolesArray = []; //how to make this dynamic
let depArray = [];
let managerArray = [];
let localEmployeeArray = [];

class Department {
    constructor(id, name) {
      this.name = name;
      this.value = id;
    }
};

class Role {
    constructor(id, name){
        this.name = name;
        this.value = id;
    }
}

class Manager {
    constructor(id, name){
        this.name = name;
        this.value = id;
    }
}

const newdep = () => {
    connection.query (
        'SELECT * FROM department', (err, res) => {
            depArray = [];
            if(err) throw err;
            for (i = 0 ; i < res.length; i++) {
                const temp = new Department (res[i].iddep, res[i].name)
                depArray.push(temp)
            }
        }
    )
}

const newrole = () => {
    connection.query(
        'SELECT * FROM role', (err, res) => {
            rolesArray = [];
            if (err) throw err;
            for(i = 0; i < res.length; i++) {
                const temp = new Role (res[i].idrole, res[i].title)
                rolesArray.push(temp);
            }
        }
    )
}

const newmanager = () => {
    connection.query("SELECT employee.first_name, employee.last_first, employee.idem FROM employee INNER JOIN role ON role.idrole = employee.idrole WHERE role.title=?",['Manager'],
     (err, res) => {
        if (err) throw err;
        const tempA = res.map((res) => `${res.first_name} ${res.last_first}`);
        managerArray = [];
        for(i = 0;i <res.length; i++) {
            const temp = new Manager (res[i].idem, tempA[i])
            managerArray.push(temp);
        }
        const temp = new Manager (0, 'None')
        managerArray.push(temp);
    })
}

const start = () => {
    inquirer
    .prompt({
        name: 'mainquestion',
        type: 'list',
        message: 'What function would you like to perform?',
        choices: ['Add Department', 'Add Roles', 'Add Employees', 'View Departments', 'View Roles', 'View Employees', "Update Employee Role", 'Done'],
    })
    .then((answer) => {
        if (answer.mainquestion === 'Add Department') {
            departmentQuestions();
        } else if (answer.mainquestion === 'Add Employees') {
            employeeQuestions();
        } else if (answer.mainquestion === 'Add Roles') {
            roleQuestions();
        } else if (answer.mainquestion === 'View Departments') {
            viewDepartments();
        } else if (answer.mainquestion === 'View Roles') {
            viewRoles();
        } else if (answer.mainquestion === 'View Employees') {
            viewEmployees1();
        } else if (answer.mainquestion === 'Update Employee Role'){
            updateEmployeeRoles();
        } else {
            connection.end();
        }
    })
}

const departmentQuestions = () => {
    inquirer
    .prompt({
        name: 'name',
        type: 'input',
        message: 'What is the department name you would like to add?'
    })
    .then((response) => {
        connection.query(
            'INSERT INTO department SET ?',
            {
              name: response.name,  
            },
            (err) => {
                if (err) throw err;
                console.log('Your Department has succesfully been created!');
                newdep()
                start();
            }
        )
    })
}

const employeeQuestions = () => {
    inquirer
    .prompt([
    {
        name: 'fname',
        type: 'input',
        message: "What is the employee's first name?"
    },
    {
        name: 'lname',
        type: 'input',
        message: "What is the employee's last name?"
    },
    {
        name: "role",
        type: 'list',
        message: "What is the employee's role?",
        choices: rolesArray,
    },
    {
        name: 'manager',
        type: 'list',
        message: "Who is the employee's manager?",
        choices: managerArray,
    },
    ])
    .then((response) => {
        if (response.manager === 0) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: response.fname,
                    last_first: response.lname,
                    idrole: response.role,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Your Manager has been succesfully added!');
                    newmanager();
                    start();
                    viewEmployees();
                }
            )
        } else (
        connection.query(
            "INSERT INTO employee SET ?",
             {
                first_name: response.fname,
                last_first: response.lname,
                idrole: response.role,
                manager_id: response.manager,
            },
            (err) => {
                if (err) throw err;
                console.log('Your Employee has been succesfully added!');
                start();
                viewEmployees();
            }
        ))
     })
}

const roleQuestions = () => {
    inquirer
    .prompt([
    {
        name: 'name',
        type: 'input',
        message: 'What is the name of the role you would like to add?',
    },
    {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of the role?',
        validate(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          },
    },
    {
        name: 'department',
        type: 'list',
        message: 'In what department is this role?',
        choices: depArray,
    },
    ])
    .then((response) => {
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: response.name,
                salary: response.salary,
                iddep: response.department,
            },
            (err) => {
                if (err) throw err;
                console.log('Your Role has been succesfully added!');
                newrole();
                start();
            }
        )
    })
}

const viewDepartments = () => {
    connection.query(
    'SELECT name FROM department', (err, res) => {
        if (err) throw err;
        console.log('------------------DEPARTMENTS------------------');
        console.table(res);
        start();
    }
    )
}

const viewRoles = () => {
    connection.query(
        'SELECT role.title, role.salary, department.name  FROM role INNER JOIN department ON role.iddep= department.iddep', (err, res) => {
            if (err) throw err;
            console.log('----------------------------ROLES----------------------------');
            console.table(res);
            start();
        }
    )
}

class Employee {
    constructor(name, id, role, salary, department, manager) {
        this.name = name;
        this.value = id;
        this.role = role;
        this.salary = salary;
        this.department = department;
        this.manager = manager;
       }
}

const getManager = (manager)=> {
    if (! manager) {return null;} 
    for (x = 0 ; x < managerArray.length; x ++){
        if (managerArray[x].value === manager) {
            return managerArray[x].name;
        }
    }}

let tempName = [];

const viewEmployees = () => {
    connection.query(
        'SELECT  employee.idem, employee.first_name, employee.last_first, role.title, role.salary, department.name, employee.manager_id FROM employee INNER JOIN role ON employee.idrole = role.idrole INNER JOIN department ON role.iddep = department.iddep', 
        (err, res) => {
            if (err) throw err;
            tempName = res.map((res) => `${res.first_name} ${res.last_first}`)
            localEmployeeArray = [];
            for(i = 0; i < res.length; i++) {
                let noodles = getManager(res[i].manager_id);
                const temp = new Employee (tempName[i],res[i].idem, res[i].title, res[i].salary, res[i].name, noodles)
                localEmployeeArray.push(temp);
            }
        }
    )
}

const viewEmployees1 = () => {
    connection.query(
        'SELECT  employee.idem, employee.first_name, employee.last_first, role.title, role.salary, department.name, employee.manager_id FROM employee INNER JOIN role ON employee.idrole = role.idrole INNER JOIN department ON role.iddep = department.iddep', 
        (err, res) => {
            if (err) throw err;
            console.log('------------------------------------------EMPLOYEES-------------------------------------------')
            tempName = res.map((res) => `${res.first_name} ${res.last_first}`)
            localEmployeeArray = [];
            for(i = 0; i < res.length; i++) {
                let noodles = getManager(res[i].manager_id);
                const temp = new Employee (tempName[i],res[i].idem, res[i].title, res[i].salary, res[i].name, noodles)
                localEmployeeArray.push(temp);
            }
            console.table(localEmployeeArray);
            start();
        }
    )
}

const updateEmployeeRoles = () => {
    inquirer
    .prompt ([
    {
        name: 'name',
        type: 'list',
        message: 'For which employee would you like to update their role?',
        choices: localEmployeeArray,
    },
    {
        name : 'role',
        type: 'list',
        message: 'What new role would you like to give them?',
        choices: rolesArray,
    }
    ])
    .then ((response) => {
        console.log("The employee's role has been succesfully changed!");
        connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    idrole: response.role
                },
                {
                    idem: response.name
                }
            ]
        )
        start();
    })
}

connection.connect((err) => {
    if (err) throw err;
    start()
    newdep();
    newrole();
    newmanager();
    viewEmployees();
})
