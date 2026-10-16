# Portfolio: D/BSE/24/0016

| | |
|---|---|
| **Name** | N.A.S. Prasadika |
| **Student ID** | D/BSE/24/0016 |
| **Role** | Product Owner |
| **Project** | Local Gym & Fitness Studio Membership Management System |
| **Methodology** | Rapid Application Development (RAD), 8 weeks |
| **Client** | Team 02 (representative: Lakindu Abeyrathne) |
| **Institution** | KDU University College, Batch 41 |

---

## 1. Summary of My Contributions

As the Product Owner, I represented the client and the end users, defined what the system should do, and made sure the team built it. I also contributed to development by building the Member Module. My main contributions were:

1. Finalizing the project scope
2. Categorizing requirements into functional and non-functional requirements
3. Keeping the project aligned with the client's needs and vision
4. Leading client meetings and recording them
5. Planning User Acceptance Testing and obtaining client acceptance
6. Building the Member Module
7. Writing project documentation

---

## 2. Scope Finalization

I worked with the client to decide what would be built in the 8-week timeline, with a four-member team.

**In scope:** user authentication, member registration and management, membership package management, attendance tracking, trainer management, fitness class scheduling, payment management, dashboard and reports, and the Membership Transfer Report (PDF).

**Out of scope (Future Enhancements):** QR code check-in, online payment gateway, mobile application, email and SMS notifications, multi-branch management, and wearable device integration.

**Constraints I documented:** 8-week limit, four-member student team, internet connection required, MySQL database, web-based application only.

Moving the larger features to Future Enhancements protected the time needed for the core modules.

---

## 3. Requirements Categorization

I organized the requirements in the Software Requirements Specification (SRS) into two groups.

**Functional requirements (what the system does)**

| ID | Requirement |
|---|---|
| FR-1 | Register, update, search and deactivate members |
| FR-2 | Secure login and logout |
| FR-3 | Manage membership plans, renewals and expiry status |
| FR-4 | Record daily attendance |
| FR-5 | Manage trainers and fitness class schedules |
| FR-6 | Record payments and keep payment history |
| FR-7 | Generate attendance and payment reports |
| FR-8 | Display membership status and expiry date |
| FR-9 | Generate the Membership Transfer Report (PDF) |

**Non-functional requirements (how well it works)**

| Category | Requirement |
|---|---|
| Usability | Responsive, user-friendly interface |
| Security | Encrypted passwords and role-based access |
| Performance | Pages respond in under 3 seconds |
| Reliability | Reliable data storage in MySQL |
| Compatibility | Works on modern web browsers |
| Maintainability | Modular, maintainable code |

I also prioritized the requirements (Must, Should, Could, Won't) so the team knew what to build first.

---

## 4. Client Alignment and Vision

**Vision:** Replace manual gym record-keeping with a secure, centralized web system that helps gyms manage members efficiently and gives members access to their own information.

To keep the project aligned with the client, I:
- Gathered the client's needs in the Requirements Planning phase and linked each need to a requirement
- Presented wireframes and prototypes for feedback in the User Design phase
- Reviewed working modules with the client during Construction
- Checked every suggested change against the 8-week timeline before accepting it

The client's key needs were less paperwork, accurate member and payment records, clear membership status, organized trainers and classes, and the ability for members to take their history to another gym (the Membership Transfer Report).

---

## 5. Client Meetings

I led the client meetings and recorded them in the **Client Meeting Log** (`Client-Meeting-Log.docx`). Each record lists the attendees, purpose, topics discussed, decisions and action items with owners. The meetings followed the RAD phases:

| Meeting | RAD phase | Focus |
|---|---|---|
| 1 | Requirements Planning | Client needs and scope |
| 2 | User Design | Wireframes and database design |
| 3 | Construction | Demo of working modules and feedback |
| 4 | Cutover | Final demo and acceptance |

---

## 6. Client Acceptance

I planned the User Acceptance Testing with the client, **Team 02**, whose representative is **Lakindu Abeyrathne**. The UAT Acceptance Document (`UAT-Acceptance-Document.docx`) contains:
- Ten acceptance test cases linked to FR-1 to FR-9 and the usability and performance requirements
- The client's feedback, which was positive about the project overall
- The issue and change request log
- The final decision and the sign-off by the client representative and me

GitHub issue #17 (Client User Acceptance Testing & Feedback Fixes) was used to track the feedback and any fixes.

---

## 7. Development Work: Member Module

I built the member-facing side of the system.

```
member/
├── css/                  # Stylesheets
├── js/                   # Shared JavaScript core modules
├── index.html            # Landing page
├── login.html            # Member login
├── register.html         # Member registration
├── dashboard.html        # Member dashboard
├── profile.html          # Member profile
├── attendance.html       # Attendance history
├── payments.html         # Payment records
├── book-a-class.html     # Class booking
├── no-membership.html    # Page for members without an active plan
└── reports.html          # Member reports
```

| Page | What it does | Requirement |
|---|---|---|
| login.html, register.html | Secure access and sign-up | FR-1, FR-2 |
| dashboard.html | Shows membership status and expiry | FR-8 |
| profile.html | Shows personal and membership details | FR-8 |
| attendance.html | Shows attendance history | FR-4 |
| payments.html | Shows payment history | FR-6 |
| book-a-class.html | Shows class schedule and booking | FR-5 |
| no-membership.html | Handles members with no active plan | FR-3 |
| reports.html | Member reports and transfer report | FR-9 |

I committed the work in stages: the styles, the shared JavaScript core modules, and then the member pages.

---

## 8. Documentation

| Document | Purpose |
|---|---|
| Software Requirements Specification (SRS) | Defines the system, requirements and scope |
| Client Meeting Log | Records client meetings and decisions |
| UAT Acceptance Document | Records the test results and client acceptance |
| User Manual | Explains how members and administrators use the system |
| README contributions section | Explains each team member's role |
| This portfolio | Explains my contributions |

---

## 9. Reflection

As Product Owner, I learned that the main job is to turn the client's needs into clear requirements and keep the team focused on them. RAD's short cycles let the client react to real wireframes and working screens, which caught problems early.

The hardest part was balancing scope against time. With four members and eight weeks, I had to move attractive features such as QR check-in and online payments to Future Enhancements so the core modules could be finished. Splitting requirements into functional and non-functional ones, and prioritizing them, made these decisions easier to explain.

Building the Member Module showed me the system from the member's point of view, which made me more careful when writing requirements for members. If I did the project again, I would write the acceptance criteria earlier, record every meeting decision as it happened, and set up issue tracking from the first week.

---

