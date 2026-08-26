require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { body, query, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

const db = require("./db");
const { generateUsername, generatePassword } = require("./generators");

const app = express();
const PORT = process.env.PORT || 4000;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

const PLANS = {
  basic: { name: "Basic", priceRs: 3000 },
  standard: { name: "Standard", priceRs: 2500 },
  premium: { name: "Premium", priceRs: 2000 },
};

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Basic rate limiting to slow down brute-force / spam signups.
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/plans", (req, res) => {
  res.json({ plans: PLANS });
});

app.get(
  "/api/generate-username",
  [query("seed").optional().isString().trim().isLength({ max: 100 })],
  (req, res) => {
    const seed = req.query.seed || "";
    let value = generateUsername(seed);

    // Ensure uniqueness against existing members.
    let attempts = 0;
    while (db.get("members").find({ username: value }).value() && attempts < 10) {
      value = generateUsername(seed);
      attempts += 1;
    }

    res.json({ value });
  }
);

app.get("/api/generate-password", (req, res) => {
  const value = generatePassword(12);
  res.json({ value });
});

const registerValidators = [
  body("fullName").trim().isLength({ min: 2 }).withMessage("Full name is required."),
  body("email").trim().isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("phone")
    .trim()
    .matches(/^[0-9+\-\s()]{7,15}$/)
    .withMessage("A valid phone number is required."),
  body("dob").isISO8601().withMessage("A valid date of birth is required."),
  body("gender")
    .isIn(["female", "male", "non-binary", "prefer-not-to-say"])
    .withMessage("A valid gender selection is required."),
  body("address").trim().isLength({ min: 5 }).withMessage("Home address is required."),
  body("plan").isIn(Object.keys(PLANS)).withMessage("A valid membership plan is required."),
  body("username").trim().isLength({ min: 3, max: 30 }).withMessage("Username must be 3-30 characters."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
];

app.post("/api/register", registerLimiter, registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, errors: errors.array() });
  }

  const { fullName, email, phone, dob, gender, address, plan, username, password } = req.body;

  const members = db.get("members");

  if (members.find({ email: email.toLowerCase() }).value()) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }
  if (members.find({ username }).value()) {
    return res.status(409).json({ error: "That username is already taken." });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const member = {
    id: uuidv4(),
    fullName,
    email: email.toLowerCase(),
    phone,
    dob,
    gender,
    address,
    plan,
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  members.push(member).write();

  const { passwordHash: _omit, ...safeMember } = member;
  res.status(201).json({ member: safeMember });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Fitness Center API listening on http://localhost:${PORT}`);
});
