# Fitness Center — Member Signup

```
fitness-app/
├── frontend/         Plain HTML/CSS/JS — no build step
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/          Node.js + Express API
    ├── server.js
    ├── db.js
    ├── generators.js
    ├── package.json
    └── .env.example
```

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```
Runs on http://localhost:5000 by default. Data is stored and processed through backend handlers and API endpoints — swap db.js for a relational database (MySQL, Postgres, etc.) in production

### API
| Method | Route | Description |
|---|---|---|
| **GET** | `/api/health` | Health check |
| **GET** | `/api/plans` | Membership plans and pricing details |
| **GET** | `/api/generate-username` | `?seed=Full+Name` (optional) → suggested username |
| **GET** | `/api/generate-password` | Random strong password generator |
| **POST** | `/api/register` | Create a member account |
| **GET** | `/api/checkins` | Fetch member check-in history |
| **GET** | `/api/attendance` | Fetch and record attendance logs |
| **GET** | `/api/classes` | Retrieve class schedules and trainer info |
| **GET** | `/api/dashboard` | Aggregate dashboard metrics |

`POST /api/register` body:

{
  "fullName": "Nadeesha Perera",
  "email": "nadeesha@example.com",
  "phone": "0771234567",
  "dob": "1998-05-14",
  "gender": "female",
  "address": "12 Galle Road, Matara",
  "plan": "standard",
  "username": "nadeesha.perera8430",
  "password": "MS3xX8!$a9k^"
}
```

Passwords are hashed with bcrypt before storage; the hash is never returned in API responses. Duplicate emails/usernames are rejected with 409, and malformed input is rejected with 400 plus per-field error messages.

## Frontend

Just open `frontend/index.html` in a browser, or serve it with any static
server, e.g.:

```bash
cd frontend
npx serve .
```

By default, the frontend JavaScript components (api-helper.js, dashboard.js, attendance-script.js, etc.) connect to the API at http://localhost:5000/api. To point it at a custom backend URL, configure window.API_BASE in api-helper.js or before main scripts load:

```html
<script>window.API_BASE = "http://localhost:5000/api";</script>
<script src="script.js"></script>
```

## Team Contributions

This project was developed by a four-member team using the Rapid Application Development (RAD) methodology over an 8-week period. Each member took one of four roles.

| Role | Team Member | Student ID |
|---|---|---|
| **Product Owner** | N.A.S. Prasadika | D/BSE/24/0016 |
| **Scrum Master** | T.H. Nikeshala Dewindi | D/BSE/24/0025 |
| **UI/UX Designer** | B.A.S.A. Wijayasekara | D/BSE/24/0026 |
| **Software Developer** | B.N.R. Fernando | D/BSE/24/6881 |

### Product Owner: N.A.S. Prasadika (D/BSE/24/0016)
- Defined and finalized the project scope and the vision with the client
- Categorized requirements into functional (FR-1 to FR-9) and non-functional requirements and set their priorities
- Led client meetings and recorded discussions in the Client Meeting Log
- Planned and coordinated User Acceptance Testing and obtained client acceptance
- Built the Member Module (login, register, dashboard, profile, attendance, payments, book a class, no-membership and reports pages, with shared CSS and JavaScript)

Scrum Master: T.H. Nikeshala Dewindi (D/BSE/24/0025)
-Facilitated all Scrum ceremonies (daily standups, sprint planning, reviews, retrospectives) and tracked team velocity.
-Maintained and updated the GitHub Projects Kanban board and issue backlogs across all 5 sprints.
-Authored Definition of Done (DoD), sprint journals, retrospectives, and issue linkage documentation.
-Managed pull request reviews, feature branch integrations, and clean main branch merges.

-Provided cross-functional frontend development support (Admin/Trainer dashboards, attendance logs, check-ins, report generation, and member registration interfaces).

### UI/UX Designer: B.A.S.A. Wijayasekara (D/BSE/24/0026)
- Designed wireframes and prototypes for member, trainer, and administrator screens.
- Ensured a responsive user experience across desktop and mobile browsers.
- Refined UI assets based on iterative client feedback.

### Software Developer: B.N.R. Fernando (BSE/6881)
- Designed system architecture and built the Node.js/Express backend with modular routes, controllers, middleware, and database configuration layers.
- Implemented JWT authentication, bcrypt password hashing, and role-based access control (`verifyToken`, `requireRole('admin')`).
- Developed full REST API modules for auth, members, attendance, payments, membership plans, classes, reports, and real-time dashboard stats (`GET /api/dashboard/stats`).
- Built the Membership Transfer Report module with downloadable PDF export functionality.
- Configured MySQL database connectivity and authored SQL queries (joins and aggregation) for dashboard metrics and reports.
- Replaced hardcoded frontend demo values across Dashboard, Membership Plans, and Reports pages with live API data integrations.
- Conducted endpoint testing using Terminal, MySQL Workbench, and browser DevTools.

### Client
- Client: Team 02
- Client representative: Lakindu Abeyrathne

Project Verification & Links
Main Project Repository: Local-Gym-Management-System
Local Application Host: http://localhost:5000
Agile Kanban Board: GitHub Projects - Sprint Board
Sprint Documentation: Sprint Journals, Retrospectives & Definition of Done




