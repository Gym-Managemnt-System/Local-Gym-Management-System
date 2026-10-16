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

Runs on `http://localhost:4000` by default. Data is stored in `backend/db.json`
(created automatically) — swap `db.js` for a real database (Postgres, Mongo,
etc.) in production; the rest of the app doesn't need to change.

### API

| Method | Route                     | Description                                  |
|--------|---------------------------|-----------------------------------------------|
| GET    | `/api/health`             | Health check                                  |
| GET    | `/api/plans`               | Membership plans and prices                   |
| GET    | `/api/generate-username`   | `?seed=Full+Name` (optional) → suggested username |
| GET    | `/api/generate-password`   | Random strong password                        |
| POST   | `/api/register`            | Create a member account (see body below)      |

`POST /api/register` body:

```json
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

Passwords are hashed with bcrypt before storage; the hash is never returned
in API responses. Duplicate emails/usernames are rejected with `409`, and
malformed input is rejected with `400` plus per-field error messages.

## Frontend

Just open `frontend/index.html` in a browser, or serve it with any static
server, e.g.:

```bash
cd frontend
npx serve .
```

By default it calls the API at `http://localhost:4000/api`. To point it at a
different backend URL, set `window.API_BASE` before `script.js` loads:

```html
<script>window.API_BASE = "https://your-api.example.com/api";</script>
<script src="script.js"></script>
```

The form:
- Validates all fields client-side before submitting.
- "Generate username" / "Generate Password" call the backend generators
  (falling back to a client-side generator if the API is unreachable).
- Submits to `POST /api/register` and shows a success or error message.

## Notes / next steps for production

- Replace the JSON file store with a real database.
- Add HTTPS, a proper `CORS_ORIGIN`, and stronger rate limiting in front of `/api/register`.
- Add email verification and a login endpoint (`/api/login`) issuing a session or JWT.
- Consider CSRF protection if the frontend and backend are on different origins with cookies.


## Team Contributions

This project was developed by a four-member team using the Rapid Application Development (RAD) methodology over an 8-week period. Each member took one of four roles.

| Role | Team member | Student ID |
|---|---|---|
| Product Owner | N.A.S. Prasadika | D/BSE/24/0016 |
| Scrum Master | U.D. Rajeewa | D/BSE/24/0009 |
| UI/UX Designer | J.A.H.S. Jayasooriya | D/BSE/24/0012 |
| Software Developer | Behan Ravishka | D/BSE/24/0022 |

### Product Owner: N.A.S. Prasadika (D/BSE/24/0016)
- Defined and finalized the project scope and the vision with the client
- Categorized requirements into functional (FR-1 to FR-9) and non-functional requirements and set their priorities
- Led client meetings and recorded discussions in the Client Meeting Log
- Planned and coordinated User Acceptance Testing and obtained client acceptance
- Built the Member Module (login, register, dashboard, profile, attendance, payments, book a class, no-membership and reports pages, with shared CSS and JavaScript)

### Scrum Master: U.D. Rajeewa (D/BSE/24/0009)
- Organized the RAD iterations and kept the team on the 8-week schedule
- Ran team check-ins and removed blockers
- Tracked tasks and issues in the repository

### UI/UX Designer: J.A.H.S. Jayasooriya (D/BSE/24/0012)
- Created the wireframes and prototypes for the member and administrator screens
- Designed a responsive, easy-to-use interface for desktop and mobile
- Updated the designs using feedback from client reviews

### Software Developer: Behan Ravishka (D/BSE/24/0022)
- Developed the backend API, database and authentication
- Implemented member registration, membership plans, attendance, payments, trainers and class scheduling
- Built the Membership Transfer Report (PDF export) and the reports for administrators

### Client
- Client: Team 02
- Client representative: Lakindu Abeyrathne
