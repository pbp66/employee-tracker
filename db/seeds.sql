-- Update values for the Departments Table
INSERT INTO departments (dept_name) VALUES ("Accounting");
INSERT INTO departments (dept_name) VALUES ("HR");
INSERT INTO departments (dept_name) VALUES ("Operations");
INSERT INTO departments (dept_name) VALUES ("Logistics");
INSERT INTO departments (dept_name) VALUES ("Engineering");
INSERT INTO departments (dept_name) VALUES ("Quality Control");
INSERT INTO departments (dept_name) VALUES ("Internal Auditing");

-- Update Values for the Roles Table
-- Accounting Department
INSERT INTO roles (title, salary, department_id) 
VALUES ("Accounting Manager", 100000, 1);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Accountant", 90000, 1);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Accountant - 3", 80000, 1);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Accountant - 2", 70000, 1);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Accountant", 60000, 1);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Accoutant", 50000, 1);

-- HR Department
INSERT INTO roles (title, salary, department_id) 
VALUES ("HR Manager", 100000, 2);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Associate", 90000, 2);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Lead Recruiter", 80000, 2);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Recruiter", 70000, 2);

INSERT INTO roles (title, salary, department_id) 
VALUES ("HR Associate", 60000, 2);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Associate", 50000, 2);

-- Operations
INSERT INTO roles (title, salary, department_id) 
VALUES ("Operations Manager", 100000, 3);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Production Engineer", 90000, 3);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Production Supervisor", 80000, 3);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Production Lead", 70000, 3);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Operator", 60000, 3);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Operator", 50000, 3);

-- Logistics
INSERT INTO roles (title, salary, department_id) 
VALUES ("Logisitics Manager", 100000, 4);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Analyst", 90000, 4);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Scheduler", 80000, 4);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Coordinator", 70000, 4);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Scheduler", 60000, 4);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Coordinator", 50000, 4);

-- Engineering
INSERT INTO roles (title, salary, department_id) 
VALUES ("Engineering Manager", 100000, 5);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Engineer", 90000, 5);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Engineer", 80000, 5);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Engineer", 70000, 5);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Engineering Co-Op", 60000, 5);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Engineering Intern", 50000, 5);

-- Quality Control
INSERT INTO roles (title, salary, department_id) 
VALUES ("QC Manager", 100000, 6);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Analyst", 90000, 6);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Tester", 80000, 6);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Tester", 60000, 6);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Tester", 50000, 6);

-- Internal Auditing
INSERT INTO roles (title, salary, department_id) 
VALUES ("Internal Auditing Manager", 100000, 7);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Audit Analyst", 90000, 7);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Audit Analyst", 80000, 7);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Senior Auditor", 70000, 7);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Auditor", 60000, 7);

INSERT INTO roles (title, salary, department_id) 
VALUES ("Junior Auditor", 50000, 7);

-- Update Values for the Employee Table
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("John", "Sawyer", 25, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Beth", "Smith", 26, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Fred", "Hale", 27, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Maximus", "Strange", 1, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Tony", "Rogers", 3, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Chris", "Stark", 19, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Evan", "Evans", 20, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Rebecca", "George", 22, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Cleopatra", "Banner", 21,3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Nate", "Wexner", 24, 3);