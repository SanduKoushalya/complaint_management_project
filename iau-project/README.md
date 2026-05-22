# SLTMobitel IAU — Complaint & Concern Reporting Portal

**Document Ref:** SLT-IAU-PORTAL-SPEC-001 v1.0
**Authority:** CEO Circular No. 23/2026
**Classification:** CONFIDENTIAL

---

## About This Project

This is the official **Internal Affairs Unit (IAU) Complaint and Concern Reporting Portal** for Sri Lanka Telecom PLC (SLTMobitel). It allows employees, vendors, customers, and the general public to securely and confidentially report concerns of bribery, corruption, fraud, and malpractice within the SLTMobitel Group.

The portal operates in coordination with CIABOC and within the framework of the Anti-Corruption Act, Proceeds of Crime Act, Public Property Act, and the Penal Code.

---

## Project Structure

```
iau-project/
├── iau-portal/              → React frontend (reporter portal + admin dashboard)
│   ├── public/              → Static files (logo, index.html)
│   └── src/
│       ├── admin/           → Admin dashboard components
│       ├── components/      → Shared components (ProgressBar, TrackComplaint)
│       ├── sections/        → Form sections (Section1 to Section6)
│       ├── utils/           → PDF generator
│       ├── App.js           → Main app entry point
│       ├── api.js           → API calls to backend
│       └── index.css        → All styles
│
└── iau-portal-backend/      → Node.js / Express / MySQL backend
    └── src/
        ├── db/              → Database connection + schema.sql
        ├── middleware/       → Auth, upload, validation
        ├── routes/          → API route handlers
        └── utils/           → Logger, CRN generator, email, audit log
```

---

## Prerequisites

| Tool    | Minimum Version |
|---------|----------------|
| Node.js | 16.x or higher |
| npm     | 8.x or higher  |
| MySQL   | 8.0 or higher  |

---

## First-Time Setup

### 1. Set up the database

Open PowerShell or Command Prompt and run:

```powershell
Get-Content iau-portal-backend/src/db/schema.sql | mysql -u root -p
```

Then create the application user inside MySQL:

```sql
CREATE USER IF NOT EXISTS 'iau_user'@'localhost' IDENTIFIED BY 'Admin12345';
GRANT SELECT, INSERT, UPDATE ON iau_portal.* TO 'iau_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Install backend packages

```bash
cd iau-portal-backend
npm install
```

### 3. Install frontend packages

```bash
cd iau-portal
npm install
```

---

## Running the Project

Open **two terminals** in VS Code:

**Terminal 1 — Backend:**
```bash
cd iau-portal-backend
npm run dev
```

You should see:
```
MySQL connection verified ✓
IAU Portal backend running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd iau-portal
npm start
```

Browser opens automatically at **http://localhost:3000**

---

## URLs

| Page | URL |
|------|-----|
| Reporter Portal | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## Admin Login

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `Admin12345` |

> ⚠️ Change this password after first login.

---

## Features

### Reporter Portal
- **6-step complaint form** — Reporter info, complaint details, subject info, evidence upload, declaration
- **Named and anonymous submissions** supported
- **File uploads** — PDF, DOCX, JPG, PNG (max 10 MB, up to 5 files)
- **Track complaint** — Enter CRN to check current status at any time
- **Download as PDF** — Download a formatted copy of the complaint after submission
- **Auto email acknowledgement** — Sends CRN to reporter's email (configure SMTP in `.env`)
- **CIABOC escalation** — Automatically flags complaints involving senior management

### Admin Dashboard
- **Dashboard** — Stat cards, complaints by category, recent submissions
- **Complaints list** — Search, filter by status, CIABOC-only toggle, pagination
- **Complaint detail** — Full view of all fields, file downloads, status update
- **Audit log** — Every system event recorded with timestamp and actor

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | Server liveness check |
| POST | `/api/complaints` | Public | Submit a new complaint |
| GET | `/api/complaints/track/:crn` | Public | Check complaint status by CRN |
| GET | `/api/complaints` | JWT | List all complaints (admin) |
| GET | `/api/complaints/:crn` | JWT | Full complaint detail (admin) |
| PATCH | `/api/complaints/:crn/status` | JWT | Update complaint status (admin) |
| GET | `/api/files/:fileId` | JWT | Download evidence file (admin) |
| GET | `/api/stats` | JWT | Submission statistics (admin) |
| POST | `/api/admin/login` | Public | Admin login → JWT token |
| GET | `/api/admin/audit-log` | JWT | Paginated audit log (admin) |

---

## Database Tables

| Table | Description |
|-------|-------------|
| `complaints` | One row per submission — all 5 form sections |
| `complaint_files` | Uploaded evidence file records |
| `audit_log` | Every system event with timestamp and actor |
| `crn_sequence` | Server-side gap-free CRN counter per year |
| `admin_users` | Admin accounts with bcrypt password hashes |

---

## Environment Variables

Copy `.env` in `iau-portal-backend/` and update as needed:

| Variable | Description |
|----------|-------------|
| `DB_PASSWORD` | MySQL password for `iau_user` |
| `JWT_SECRET` | Secret key for JWT tokens — change in production |
| `SMTP_ENABLED` | Set to `true` to enable email acknowledgements |
| `SMTP_HOST` | Your SMTP server host |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |

---

## Security Notes

- Anonymous submissions — IP address is **never stored** (per spec 7.1)
- Uploaded files stored with UUID filenames on disk
- Rate limiting — 500 requests/15 min general; 20 submissions/hour on POST
- Helmet.js security headers on all responses
- CORS restricted to frontend URL only
- All data encrypted in transit (TLS) and at rest (AES-256 recommended for production)
- Data retained for minimum 7 years per Sri Lanka data protection requirements

---

## Built With

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, jsPDF, Inter font |
| Backend | Node.js, Express 4 |
| Database | MySQL 8 |
| Auth | bcryptjs, JSON Web Tokens |
| File uploads | Multer |
| Email | Nodemailer |
| Logging | Winston |

---

*This project was built per SLT-IAU-PORTAL-SPEC-001 v1.0, April 2026.*
*Issued under authority of CEO's Circular No. 23/2026 · CONFIDENTIAL*
