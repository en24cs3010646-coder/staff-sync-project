# StaffSync – Modern Human Resource Management System

StaffSync is an enterprise-grade Human Resource Management System (HRMS) built on the MERN stack (MongoDB, Express.js, React 19, Node.js) with Tailwind CSS, Lucide icons, and role-based access control (RBAC).

---

## 1. System Architecture

```
                    ┌─────────────────────────────────────────┐
                    │               React 19 SPA              │
                    │  (Vite + Tailwind CSS + Lucide Icons)   │
                    └────────────────────┬────────────────────┘
                                         │ JSON / JWT API
                    ┌────────────────────▼────────────────────┐
                    │            Node / Express API           │
                    │      (Auth, RBAC, Controllers)          │
                    └────────────────────┬────────────────────┘
                                         │ Mongoose ODM
                    ┌────────────────────▼────────────────────┐
                    │             MongoDB Database            │
                    │  (Users, Employees, Attendance, Leaves) │
                    └─────────────────────────────────────────┘
```

---

## 2. Role-Based Access Control (RBAC) Matrix

| Feature Module | HR Administrator | Department Manager | Employee |
| :--- | :---: | :---: | :---: |
| **Dashboard** | Full Enterprise Metrics | Team Roster & Approvals | Personal Attendance & Balances |
| **Employee Directory** | Create, Edit, Deactivate | View Assigned Team | View Own Profile |
| **Attendance Punch** | Monitor & Audit Correct | Team Punch Roster | Daily Clock-In / Clock-Out |
| **Leave Management** | Company-wide Approval | Team Member Approval | Apply & Cancel My Leaves |
| **Announcements** | Create, Pin, Delete | Read Announcements | Read Announcements |
| **Training Programs** | Schedule, View Roster | Schedule Team Courses | Browse & Register |
| **Analytics & Reports**| Full CSV Export & Charts | Team Level Analytics | None |
| **Audit Logs** | View Immutable Trails | None | None |

---

## 3. Seed Accounts for Testing

| Persona | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| **Sarah Jenkins** | HR Administrator | `hr@staffsync.com` | `hr123` |
| **David Vance** | VP of Engineering (Manager) | `manager.eng@staffsync.com` | `mgr123` |
| **Elena Rostova** | Head of Marketing (Manager) | `manager.mkt@staffsync.com` | `mgr123` |
| **Alex Rivera** | Senior Frontend Engineer | `alex.rivera@staffsync.com` | `emp123` |
| **Priya Sharma** | Backend Engineer | `priya.sharma@staffsync.com` | `emp123` |

*Note: In the live preview, you can also use the top **"Simulate Role"** bar to switch between HR Admin, Manager, and Employee in 1 click.*

---

## 4. RESTful API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user credentials (HR only)
- `POST /api/auth/login` - Authenticate with email/password and obtain JWT
- `GET /api/auth/me` - Retrieve current user profile and role
- `PUT /api/auth/updatepassword` - Change existing password

### Employees (`/api/employees`)
- `GET /api/employees` - Search, filter, and paginate employee directory
- `GET /api/employees/:id` - Fetch single employee details
- `POST /api/employees` - Register employee (HR only)
- `PUT /api/employees/:id` - Update employee details
- `PUT /api/employees/:id/status` - Deactivate / reactivate employee (HR only)

### Attendance (`/api/attendance`)
- `POST /api/attendance/check-in` - Record daily punch (prevents duplicate daily check-ins)
- `POST /api/attendance/check-out` - Record departure and compute work hours
- `GET /api/attendance` - Query date/department attendance records
- `PUT /api/attendance/:id/correct` - HR correction with mandatory audit reason

### Leaves (`/api/leaves`)
- `POST /api/leaves` - Apply for leave (validates balance and prevents overlapping dates)
- `PUT /api/leaves/:id/decision` - Approve or reject leave request (Manager / HR)
- `PUT /api/leaves/:id/cancel` - Cancel pending leave request (Employee)
- `GET /api/leave-balances/:employeeId` - Query remaining casual, sick, earned balances

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas URI)

### Frontend & Full Application
```bash
npm install
npm run dev
# App runs at http://localhost:3000
```

### Backend Production Server (Express + Mongoose)
```bash
cd server
npm install
# Set MONGO_URI in .env
node server.js
# REST API starts at http://localhost:5000
```
