USE e_tracker;

CREATE TABLE department (
iddep INTEGER NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY (iddep)
);

USE e_tracker;
CREATE TABLE role (
idrole INTEGER NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL (8,2) NOT NULL,
iddep INTEGER,
PRIMARY KEY (idrole),
FOREIGN KEY (iddep) REFERENCES department (iddep)
)ENGINE=INNODB;

USE e_tracker;
CREATE TABLE employee (
idem INTEGER NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_first VARCHAR(30) NOT NULL,
idrole INTEGER,
manager_id INTEGER NULL,
PRIMARY KEY (idem),
FOREIGN KEY (idrole) REFERENCES role (idrole),
FOREIGN KEY (manager_id) REFERENCES employee (idem)
)ENGINE=INNODB;