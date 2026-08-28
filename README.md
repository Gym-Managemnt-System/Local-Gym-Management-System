# Local Gym & Fitness Studio Membership Management System

A web-based Gym Membership Management System built with the **Rapid Application Development (RAD)** methodology as part of **SE32022: Rapid Application Development**, KDU.

This repository contains the **backend API** for the system. It replaces manual gym record-keeping with member management, attendance tracking, payments, trainer/class scheduling, and a Membership Transfer Report feature.

## Team

| Name | Student ID | Role |
|---|---|---|
| N.A.S.Prasadika | D/BSE/24/0016 | Product Owner |
| T.H.N. Dewindi | D/BSE/24/0025 | Scrum Master |
| B.A.S.A. Wijayasekara | D/BSE/24/0026 | UI/UX Designer |
| B.N.R.Fernando | BSE6881| Backend Developer |

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL (via `mysql2`)
- **Auth:** JWT + bcrypt (role-based access: admin / member / trainer)
- **PDF Export:** pdfkit (for the Membership Transfer Report)
- **Frontend:** plain HTML-CSS-JS

## Project Structure

```
gym-backend/
├── docs/
│   ├── architecture.md         # ERD + system diagrams (Mermaid.js)
│   ├── product-backlog.md      # Epics & User Stories index (link to GitHub Issues)
│   ├── definition-of-done.md   # Team's Definition of Done
│   └── sprint-journals.md      # Sprint goals, standups, retrospectives
├── src/
│   ├── config/
│   │   ├── db.js                # MySQL connection pool
│   │   └── schema.sql           # Database schema
│   ├── controllers/             # Route handler logic (business rules)
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification + role guards
│   └── routes/                  # Express route definitions
├── server.js                    # App entry point
├── .env.example                 # Environment variable template
└── package.json
```

## Functional Requirements Covered

| Code | Requirement | Implemented In |
|---|---|---|
| FR-1 | Register, update, search, deactivate members | `memberController.js` |
| FR-2 | Secure login/logout | `authController.js`, `authMiddleware.js` |
| FR-3 | Membership plans, renewals, expiry | `planController.js` |
| FR-4 | Daily attendance tracking | `attendanceController.js` |
| FR-5 | Trainer & class scheduling | `trainerClassController.js` |
| FR-6 | Payment records & history | `paymentController.js` |
| FR-7 | Attendance & payment reports | `attendanceController.js`, `paymentController.js` |
| FR-8 | Membership status & expiry display | `memberController.js` (`getMemberById`) |
| FR-9 | Membership Transfer Report (PDF) | `reportController.js` |

## Local Setup

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server running locally or remotely
- VS Code (recommended) with the **REST Client** or **Thunder Client** extension for testing endpoints

### 2. Clone and install
```bash
git clone <your-repo-url>
cd gym-backend
npm install
```

### 3. Configure environment variables
Copy the example file and fill in your own values:
```bash
cp .env.example .env
```
Then edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gym_management
JWT_SECRET=some_long_random_string
```

### 4. Create the database
```bash
mysql -u root -p < src/config/schema.sql
```

### 5. Run the server
```bash
npm run dev     # with nodemon (auto-restart)
# or
npm start
```
The API will be available at `http://localhost:5000/api/health`.

## API Endpoints (summary)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Login, returns JWT | Public |
| GET | `/api/members` | List/search members | Admin |
| GET | `/api/members/:id` | Get member profile | Logged in |
| POST | `/api/members` | Create member | Admin |
| PUT | `/api/members/:id` | Update member/renew plan | Admin |
| DELETE | `/api/members/:id` | Deactivate member | Admin |
| GET | `/api/plans` | List membership plans | Logged in |
| POST | `/api/plans` | Create plan | Admin |
| POST | `/api/attendance/checkin` | Record attendance | Logged in |
| GET | `/api/attendance/member/:memberId` | Member attendance history | Logged in |
| GET | `/api/attendance/report` | Attendance report | Admin |
| POST | `/api/payments` | Record payment | Admin |
| GET | `/api/payments/member/:memberId` | Payment history | Logged in |
| GET | `/api/payments/report` | Payments report | Admin |
| GET | `/api/trainers` | List trainers | Logged in |
| POST | `/api/trainers` | Add trainer | Admin |
| GET | `/api/classes` | List fitness classes | Logged in |
| POST | `/api/classes` | Create class | Admin |
| POST | `/api/classes/enroll` | Enroll member in class | Logged in |
| GET | `/api/reports/transfer/:memberId` | **Download Membership Transfer Report (PDF)** | Logged in |

## Deployment

_Add your live deployment link here once hosted (Render/Railway free tier recommended for a Node + MySQL backend)._

- **Live API URL:** `TBD`
- **Frontend URL:** `TBD`

## Sprint Workflow (for the team)

- Work is tracked on the GitHub Projects board: `Product Backlog → Sprint Backlog → In Progress → Review/QA → Done`.
- One branch per User Story, e.g. `feature/fr4-attendance-checkin`.
- Open a Pull Request into `main` for every change — never push directly to `main`.
- Reference the Issue in each PR description, e.g. `Closes #12`.
- Log standups and retrospectives in `docs/sprint-journals.md`.

## Client Handover Note

_To be completed in Sprint 5: summary of what was delivered, known limitations, and setup instructions for the client team taking over the product._
