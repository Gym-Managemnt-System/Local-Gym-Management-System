# BSE-6881 – Individual Portfolio

**Project:** Gym & Fitness Studio Membership Management System  
**Student ID:** BSE-6881  
**Role:** Backend Developer – System Architecture, Database Management, and API Integration

## 1. Introduction

My main responsibility in the Gym & Fitness Studio Membership Management System project is to develop and integrate the backend components of the system. The purpose of this project is to provide a centralized platform for managing gym memberships, member information, attendance, membership plans, payments, and reports.

I focus on designing the core system architecture, implementing backend functionality, managing the database, and developing API integrations that allow the frontend to communicate with the backend. My work supports reliable data handling and ensures that the different system modules can operate together.

## 2. Core System Architecture

I am responsible for contributing to the backend architecture and organizing the server-side components. The backend is developed using Node.js and Express.js, with separate routes, controllers, middleware, and database configuration.

The architecture separates request handling, business logic, authentication, and database operations. This structure improves code organization, maintainability, and the ability to extend the system with additional features.

My responsibilities include:
- Configuring the Express.js server and backend routes.
- Organizing controllers and route files.
- Integrating authentication middleware and role-based access control.
- Connecting frontend requests to the appropriate backend services.
- Supporting the integration of different modules within the system.

## 3. Backend Development

My backend development responsibilities include implementing server-side operations required for the gym management process. These operations support the management of members, membership plans, attendance, payments, and reports.

I work with Node.js and Express.js to handle HTTP requests, process application data, execute database queries, and return appropriate JSON responses to the frontend.

I also contribute to dashboard functionality by developing API endpoints that retrieve information such as active member counts, daily attendance, revenue, membership expiry information, recent members, classes, and pending payments.

Error handling and validation are important parts of this work because they help identify failures and provide meaningful responses when requests cannot be completed.

## 4. Database Management

I am responsible for supporting the database structure and integrating backend operations with the MySQL database.

The database stores information required for the main system modules, including user accounts, members, membership plans, attendance records, payments, classes, trainers, and class enrollments.

My responsibilities include:
- Configuring the database connection.
- Writing SQL queries to retrieve and manage application data.
- Supporting relationships between database tables.
- Using joins and aggregate queries to generate dashboard statistics and reports.
- Maintaining the database schema as system requirements evolve.
- Checking database errors and ensuring that backend queries match the existing table structures.

Database consistency is important because the dashboard and other modules depend on accurate information from related tables.

## 5. API Development and Integration

Another key responsibility is integrating the frontend with the backend through REST API endpoints. The APIs allow the frontend to request and display data without directly accessing the database.

I contribute to defining backend routes, connecting them to controller functions, processing requests, and returning JSON responses. I also support authentication and authorization to restrict protected operations according to user roles.

For example, the dashboard statistics endpoint is available through `GET /api/dashboard/stats`. It retrieves relevant information from the database and returns statistics, attendance data, recent members, classes, and payment information.

API integration helps the frontend display current system information and allows the different modules to communicate through a consistent interface.

## 6. Authentication and Authorization

Authentication and authorization are important parts of the backend. The system uses authentication middleware to protect routes and role-based authorization to control access to administrative functionality.

My responsibilities include supporting protected API routes, integrating authentication middleware, and ensuring that restricted endpoints require appropriate permissions.

The system should distinguish between administrators and members. Administrators need access to management functions, while members should be able to access their own profiles, membership information, attendance, payments, and other permitted services.

These controls help prevent unauthorized access to sensitive information.

## 7. Testing and Debugging

I contribute to testing and debugging the backend to ensure that its components work correctly. This includes checking server startup, database connectivity, API responses, route registration, and integration with the frontend.

I use the terminal and browser developer tools to investigate errors and verify API responses. I also check whether database queries return the expected results and whether empty database tables are handled correctly.

Testing helps identify issues such as incorrect routes, database schema mismatches, authentication failures, and frontend requests that do not reach the backend successfully.

## 8. Tools and Technologies

The main technologies and tools relevant to my responsibilities are:

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Backend framework for routes and API development.
- **MySQL:** Relational database management.
- **SQL:** Database queries, joins, aggregations, and schema management.
- **REST APIs:** Communication between the frontend and backend.
- **Git and GitHub:** Version control, collaboration, commits, branches, and pull requests.
- **Postman and browser developer tools:** API testing and debugging, where applicable.
- **Visual Studio Code:** Development and debugging environment.

## 9. Challenges and Solutions

One challenge in backend development is ensuring that API queries match the actual database schema. A query may fail if a referenced table or column does not exist or if its name differs from the expected structure. This requires checking the schema and updating the query accordingly.

Another challenge is connecting frontend pages to live backend data. Hardcoded demonstration values must be replaced with API responses so that dashboard statistics and member information reflect the database.

Authentication and role-based access also require careful testing to ensure that members cannot access administrative endpoints. Debugging these issues improves my understanding of backend integration, database relationships, and secure application development.

## 10. Conclusion

My contribution to the Gym & Fitness Studio Membership Management System focuses on its backend foundation. Through system architecture, backend development, database management, API integration, authentication, and debugging, I help connect the application's modules and support reliable data processing.

This work has strengthened my practical knowledge of Node.js, Express.js, MySQL, REST API development, and collaborative software development using Git and GitHub. It has also helped me understand the importance of maintainable architecture, accurate database operations, secure access control, and effective integration between frontend and backend components.
