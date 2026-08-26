# Fitness Center — Member Signup

A "Create member account" form (matching the provided design) with a working
backend API.

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
