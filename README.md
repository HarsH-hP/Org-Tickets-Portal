# Organizations Ticket System

Welcome to the repository for my Angular Organizations Internal Ticketing Portal, a robust system designed to streamline the operations of any organization by providing a sophisticated, role-based access control system. This application facilitates detailed management of departments, employees, and tickets, allowing for efficient task and personnel oversight tailored to specific roles within the company.

- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.4.

## Features

### Role-Based Access Control
- **Admins**: Full control over all system features, including detailed management of departments and employees, along with comprehensive oversight of all tickets.

- **Department Heads**: Manage specific department personnel and tickets, with additional capabilities similar to employees.
- **Employees**: Can create, start, and close tickets, focusing on task execution and resolution.

### Dynamic Management Systems
- **Department Management**:
  - Admins can add new departments with unique IDs and names. The Admin department is protected against deletion and unauthorized edits, ensuring core structural integrity.
  - Provides the flexibility to update or delete non-admin departments, with changes cascading through related employee profiles and tickets to ensure system-wide data consistency.

- **Employee Management**:
  - Allows for the creation of employee records with unique IDs and emails, with role assignments based on the selected department.
  - Facilitates easy role transitions and department changes, with immediate updates reflected across the portal.
  - Supports the deletion of employees, except for the logged-in user, to maintain operational security.

### Advanced Ticketing Interface
- **Ticket Creation and Management**:
  - Automated ticket ID generation prevents duplicates, enhancing data integrity.
  - Tickets include essential details such as severity, assigned department, and comprehensive descriptions.
  - Different panels for Admins, Department Heads, and Employees showcase tailored views and functionalities, ensuring users see only what they need to perform their roles effectively.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
