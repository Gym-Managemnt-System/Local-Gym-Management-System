# Portfolio: d-bse-24-0026

## My Role & Contributions

- **Implemented live dashboard API** – Added `GET /api/dashboard/stats` endpoint and controller logic.  
  Commit: [42dac4f](https://github.com/Gym-Managemnt-System/Local-Gym-Management-System/commit/42dac4f)
- **Created dashboard routes and controller** – Integrated the new API with Express routes and added unit tests.  
  Commit: [d4026ee](https://github.com/Gym-Managemnt-System/Local-Gym-Management-System/commit/d4026ee)
- **Updated UI components for dashboard** – Modified `dashboard.js` and related React components to display real‑time statistics and bar charts.  
  Commit: [0a213ce](https://github.com/Gym-Managemnt-System/Local-Gym-Management-System/commit/0a213ce)
- **Fixed reports page script and schema migration** – Added `is_active` column to `membership_plans` and ensured reports correctly query the new schema.  
  Commit: [8b5f663](https://github.com/Gym-Managemnt-System/Local-Gym-Management-System/commit/8b5f663)

## Critical Agile Reflection

During the sprint that introduced the live dashboard, we encountered a **merge conflict** between the UI changes and the backend API implementation.  To resolve this, the team conducted **pair‑programming sessions**, which helped us quickly understand each other's work and agree on a consistent integration strategy.  

We also relied heavily on **code reviews** to catch subtle bugs in the data‑binding logic, and we wrote **unit tests** for the new API endpoint to ensure future changes would not break the dashboard functionality.  This practice reinforced our commitment to **Test‑Driven Development (TDD)** and improved overall code quality.

Overall, the experience taught us the importance of **early communication** when multiple team members modify overlapping parts of the codebase, and it highlighted how collaborative engineering practices can turn a bottleneck into a learning opportunity.
