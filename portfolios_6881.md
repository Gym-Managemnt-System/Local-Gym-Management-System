# Individual Agile Portfolio & Reflection

- *Student Name:* BNR FERNANDO
- *Student ID:* BSE-6881
- *Role:* Backend Developer – System Architecture, Database Management, and API Integration
- *Degree Program:* BSc (Hons) in Software Engineering
- *Course Module:* SE32022: Rapid Application Development (RAD)
- *Institution:* General Sir John Kotelawala Defence University (KDU)
- *Project:* Local Gym and Fitness Studio Membership Management System

---

## 1. My Role & Contributions

As the *Backend Developer*, my responsibility was the core system architecture, back-end development, database management, and API integrations of the system. The project provides a centralized platform for managing gym memberships, members, attendance, membership plans, payments, and reports. I built the server-side components and connected the frontend pages to them so that every module worked with live data from the MySQL database.

### Significant Commits Authored

#### Backend Setup & Core Architecture
- 803f2a6 - Add backend setup: auth, members, attendance, payments, transfer report

#### Backend Implementation
- 8d87f25 - Add backend implementation

#### Frontend–Backend Integration
- d4026ee - Connect dashboard, membership plans and reports

### Core System Architecture

The backend is built with Node.js and Express.js, with separate routes, controllers, middleware, and database configuration. This separates request handling, business logic, authentication, and database operations, which improves maintainability and makes the system easy to extend.

- Configured the Express.js server, route registration, and a health-check endpoint.
- Organised controllers and route files per module (auth, members, attendance, payments, plans, classes, reports, dashboard).
- Integrated JWT authentication middleware and role-based access control.
- Connected frontend requests to the appropriate backend services.

### Back-End Development

- Implemented server-side operations for members, membership plans, attendance, payments, and reports, returning consistent JSON responses with meaningful error messages.
- Built the membership transfer report as a downloadable PDF.
- Developed the dashboard endpoint `GET /api/dashboard/stats`, which returns active member counts, daily attendance, monthly revenue, expiring memberships, recent members, classes, and pending payments.

### Database Management

- Configured the MySQL connection and wrote SQL queries to retrieve and manage application data.
- Supported relationships between users, members, membership plans, attendance, payments, classes, trainers, and class enrollments.
- Used joins and aggregate queries to generate dashboard statistics and reports.
- Kept the schema aligned with the controllers as requirements evolved (for example adding `is_active` to `membership_plans` and the missing columns on `classes`).

### API Development and Integration

- Defined REST routes, connected them to controller functions, and processed requests and responses between the frontend and the database.
- Replaced hardcoded demonstration values on the Dashboard, Membership Plans, and Reports pages with live API data.
- Protected administrative endpoints so that only authorised roles could access them (`verifyToken`, `requireRole('admin')`).

### Testing and Debugging

- Verified server startup, database connectivity, route registration, API responses, and frontend integration.
- Used the terminal, MySQL Workbench, and browser developer tools (Network tab) to inspect failing requests and fix the underlying causes.
- Checked that empty database tables were handled correctly on the frontend.

### Tools and Technologies

Node.js, Express.js, MySQL, SQL, REST APIs, JWT, Git and GitHub, MySQL Workbench, Visual Studio Code.

---

## 2. Critical Agile Reflection

### Team Bottleneck Faced
The main bottleneck was keeping the database schema, the backend controllers, and the frontend pages in sync. While connecting the dashboard to the backend, the endpoint returned a 500 error (`Unknown column 'c.category'`) because the local `classes` table, created from an older `schema.sql`, did not contain the columns the controllers expected. Other integration problems appeared during local setup: the `.env` file is not stored in the repository, so each machine needed its own, and login initially failed with "Invalid email or password" because the admin account existed only in another developer's local database.

### Adaptation & Self-Organization
I diagnosed each problem from evidence instead of guessing: reading the real API response in the browser Network tab, checking table structures with `DESCRIBE` in MySQL Workbench, and then fixing the root cause with targeted `ALTER TABLE` changes and an admin account registered through the API so the password was hashed correctly. For the local demonstration I kept the setup repeatable with a `.env.example` template, the schema script, and a simple run procedure (`npm install`, create `.env`, `npm run dev`, check `/api/health`). Integration work was done on a separate feature branch so the stable branch was not disturbed.

### Applied Engineering Practices
- *Secure API Design:* JWT authentication, role-based middleware, bcrypt password hashing, and server-side input validation.
- *Separation of Concerns:* routes, controllers, middleware, and database configuration kept in separate layers.
- *Incremental, Testable Delivery:* each module was tested endpoint by endpoint before the frontend was connected.
- *Version Control:* feature-branch workflow with descriptive commit messages.

---

## 3. Verified Contribution Audit

My contributions are verified through the Git commit history of the `Gym-Managemnt-System/Local-Gym-Management-System` repository, covering the initial backend setup (803f2a6), the backend implementation (8d87f25), and the dashboard, membership plans, and reports integration (d4026ee), together with the working REST API and MySQL schema delivered for the final demonstration.
