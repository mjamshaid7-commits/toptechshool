# TopTech School Management Suite

A responsive React + Vite frontend demo for a school management system, branded for TopTech Solutions.

## Included in this build
- Dashboard with overview cards, charts, quick actions, and recent students
- Student list with search and class filter
- Add student form and student profile view
- CSV export of student records
- Browser-local persistence for student records (`localStorage`)
- Attendance checklist demo
- Fee overview with sample invoice records
- Responsive desktop, tablet, and mobile layouts
- Navigation scaffolding for teachers, classes, examinations, timetable, homework, expenses, parents, payroll, reports, and settings

## Important limitations
This ZIP is a functional **frontend demo**, not a production-ready school information system. It has no backend API, database, authentication, server-side role permissions, real payment processing, automated SMS/WhatsApp, or production backup system. Attendance is held in the current browser session. Fee records are sample/demo data. Do not use it to store real student records or record real payments.

## Run locally
1. Install Node.js 20 or newer.
2. Extract the ZIP.
3. Open a terminal in this folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local address shown by Vite (typically `http://localhost:5173`).

## Production build (frontend only)
```bash
npm run build
npm run preview
```

## Suggested next step
Add a secured backend (for example, Node.js/Express + PostgreSQL + Prisma), real authentication and role-based access control, database migrations, audit logging, tests, and a secure deployment process before using this for a real school.
