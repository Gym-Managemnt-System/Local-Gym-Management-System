Individual Agile Portfolio & Reflection
Student ID: [INSERT_YOUR_STUDENT_ID_HERE]

GitHub Username: @Aranya12345678

Repository: Gym-Managemnt-System/Local-Gym-Management-System

1. My Role & Contributions
Primary Responsibilities
Throughout the development of the Local Gym Management System, my primary responsibilities centered around Frontend UI Integration, Trainer Management Module Development, and Branch Maintenance & Merge Conflict Resolution.

key contributions include:

Frontend UI Layouts & Scripting: Built and integrated interactive interfaces across core views including dashboard.html, trainers.html, members.html, and login.html.

API Integration & Endpoint Testing: Connected frontend scripts (trainers-script.js, register-trainer-script.js) to Express backend controllers (/api/trainers/register), verifying token-based authentication (JWT) and request/response payloads via curl and browser developer tools.

Version Control & Branch Synchronization: Managed cross-branch integration between UI feature branches (frontend-ui) and backend branches (feature/backend-setup), ensuring a clean working tree across project sprints.

Key Commits & Pull Requests
Significant Pull Requests
PR #15: Frontend UI Integration & Merge

Description: Integrated key frontend user interface modules with backend routing and resolved merge conflicts between frontend-ui and feature/backend-setup.

PR #13: Merge frontend-ui Updates

Description: Merged updated UI features, core styles, and page navigation scripts into the main development workflow[cite: 5].

Featured Commits across Sprints
Commit 0a213ce: Resolve merge conflict in dashboard.html[cite: 5]

Handled structural conflicts in dashboard layout during branch merging to maintain interface consistency[cite: 3, 5].

Commit 8b5f663: Sync frontend files and UI modules[cite: 5]

Synchronized updated styles (common.css, login.css), HTML layouts, and client-side JavaScript controllers[cite: 5].

Commit f90b3e9: Add updated UI layouts, page scripts, and frontend stylesheets[cite: 3]

Added core UI structure, modal views, and interactive scripts for system-wide components[cite: 3].

2. Critical Agile Reflection
Team Bottleneck & Adaptability
During Sprint 2, our team encountered a critical bottleneck in branch synchronization and frontend-backend payload alignment. As frontend features (like trainer registration and dashboard dynamic rendering) were developed in parallel with backend endpoints, schema mismatched fields and concurrent edits on shared files (specifically dashboard.html and server.js) caused local integration blockages and PR merge conflicts[cite: 3, 5].

To address this, I helped lead self-organization by establishing clear API payload contracts early in the sprint and taking direct responsibility for branch conflict management. I utilized terminal tools (curl, git merge, token inspection) to isolate backend endpoint behavior before merging frontend code, reducing downstream integration errors for the rest of the team.

Applied Engineering Practices
Continuous Integration & Local Verification:

Before creating PRs, we ran local API integration checks using Nodemon servers and CLI commands (curl) to verify auth headers and JWT tokens prior to committing changes.

Peer Code Reviews & Conflict Management:

We implemented strict code review practices on GitHub PRs. By resolving file conflicts locally in VS Code prior to merging PRs into base feature branches, we kept our deployment pipeline stable and working trees clean.

Incremental Component Testing:

We adopted an incremental delivery model, isolating full-stack flows (e.g., Trainer Registration 
→ JWT Auth Validation 
→ Dynamic Table Render) to verify end-to-end functionality before merging pull requests.

Instructions for Submission:
Create a file named portfolio-[YOUR_STUDENT_ID].md (replace [YOUR_STUDENT_ID] with your actual ID, e.g., portfolio-it12345678.md).

Place this file directly in the root directory of your local repository.

Commit and push it to GitHub before the Week 10 deadline:

Bash
git add portfolio-[YOUR_STUDENT_ID].md
git commit -m "Add individual Agile portfolio and reflection"
git push origin feature/backend-setup
