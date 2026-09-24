# Smart Attendance Frontend

## Setup

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend API prefix, for example `http://localhost:3000/api/v1`.

Phase 9 provides demo role login, JWT-backed authentication initialization, protected role routes, and the application shell. Phase 10 adds functional Admin screens at `/admin/departments`, `/admin/academic-years`, `/admin/sections`, `/admin/students`, `/admin/faculty`, `/admin/subjects`, `/admin/subject-offerings`, and `/admin/enrollments`.

Admin screens use the real backend APIs for pagination, debounced search, supported filters, deferred relationship selectors, create/edit operations, safe deactivation confirmation, and backend error feedback. Faculty pages provide dashboard, subject assignments, attendance session creation/marking/submission, and correction requests. Student pages provide dashboard, derived attendance summaries, and paginated history. Student correction requests remain unavailable because the current backend contract does not authorize them.

The JWT is stored in browser `localStorage` for this assignment's demo authentication. The backend remains the authority for authentication and authorization.
