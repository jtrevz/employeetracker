# Employee Tracker ![badge](https://img.shields.io/badge/license-MIT-yellow.svg)
This is a command line application that helps the users keep track of their employees. This application uses several databases (3) to keep track of departments, roles, and employees.

![EmployeeTracker](https://user-images.githubusercontent.com/78758382/116194204-218d3500-a6f6-11eb-9c25-f84964686dc6.png)

## Table of Contents:
  * [Instructions](#instructions)
  * [Instructions](#instructions)
  * [License](#license)
  * [Questions](#questions)
<br>

### Database

![Database](https://user-images.githubusercontent.com/78758382/116194071-f30f5a00-a6f5-11eb-9e16-fcd54abccc1f.png)


This application consists of three tables![Uploading Screen Shot 2021-04-27 at 1.13.53 AM.png…]()
: Departments, Roles, and Employees. They each house unique data and reference each other via foreign keys when required. 

<br>

### Instructions

First, open up the schema (in the db file) named seed.sql and run the syntax to create the database and the tables. Then

![Schema](https://user-images.githubusercontent.com/78758382/116194250-37025f00-a6f6-11eb-974d-45c1164d4e43.png)

Once that has been completed, then run:
```
npm i
```
After the dependencies have been installed, run :

```
node employee.js
```
This will start the application and you are welcome to choose between the selections to add and view roles, departments, etc.

Once you have finished, you can chose the "Done" choice in the main selections page and the connection will end.
<br>


### License
[Licences](https://opensource.org/licenses/MIT)
<br>
<br>
### Questions
Any questions for me? Message me on [GitHub](https://github.com/jtrevz) or by email @ jenny.trevizo2013@gmail.com
