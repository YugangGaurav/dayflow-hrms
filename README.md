# DAYFLOW HRMS

A modern, full-stack Human Resource Management System (HRMS) designed to manage employee information, attendance, leave, payroll, documents, notifications, announcements, reports, and HR operations from a single web application.

## 🚀 Live Demo

**DAYFLOW HRMS:**  
https://yuganggaurav.github.io/dayflow-hrms/

---

## 📌 Overview

DAYFLOW is a role-based HR management platform with separate experiences for:

- 👨‍💼 Employees
- 🧑‍💼 HR / Administrators

The application connects the frontend with **Supabase** for authentication, database operations, employee records, attendance, leave requests, payroll information, announcements, audit logs, and other HR data.

The interface is designed to provide a clean, professional HR dashboard while keeping the major HR workflows organized in dedicated modules.

---

## ✨ Features

### 👨‍💼 Employee Portal

- My Workday dashboard
- Real-time check-in / working duration view
- Attendance tracking
- Monthly attendance calendar
- Leave balance
- Apply for leave
- Leave request history
- Payroll and payslip information
- Payroll history
- Employee profile
- Job information
- Document management
- Notifications
- Company announcements
- DAYFLOW Copilot interface

### 🧑‍💼 HR Administration

- Workforce Pulse dashboard
- Employee directory
- Employee records
- Leave Management
- Approve / reject leave requests
- Payroll Management
- Payroll run information
- Reports & Analytics
- Attendance trends
- Leave utilization
- Company Announcements
- Audit Logs
- HR action monitoring

### 🔐 Security & Data

- Role-based employee / HR access
- Supabase authentication
- Database-backed HR records
- Protected environment variables
- Audit logging
- Security verification documentation
- Supabase migrations and seed data

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | UI styling and responsive layout |
| JavaScript | Application logic and dynamic rendering |
| Vite | Development and production build system |
| Supabase | Authentication, database and backend services |
| PostgreSQL | Relational database through Supabase |
| Git & GitHub | Version control and deployment |
| GitHub Pages | Live deployment |

---

## 📂 Project Structure

```text
dayflow-hrms/
│
├── README.md
├── index.html
├── index.static.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
├── .env.example
│
├── src/
│   ├── auth.js
│   └── supabase.js
│
├── scripts/
│   └── create-demo-users.js
│
├── supabase/
│   ├── migrations/
│   └── seed/
│
├── docs/
│   ├── DAYFLOW_BACKEND...
│   ├── SECURITY_TESTS.md
│   └── VERIFICATION.md
│
└── screenshots/
    ├── 01-hr-workforce-pulse.png
    ├── 02-hr-employees.png
    ├── 03-hr-leave-management.png
    ├── 04-hr-payroll-management.png
    ├── 05-hr-reports.png
    ├── 06-hr-announcements.png
    ├── 07-hr-audit-logs.png
    ├── 08-employee-workday.png
    ├── 09-employee-profile.png
    ├── 10-employee-attendance.png
    ├── 11-employee-leave.png
    ├── 12-employee-payroll.png
    ├── 13-employee-documents.png
    ├── 14-employee-notifications.png
    ├── 15-copilot.png
    └── 16-login.png
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yuganggaurav/dayflow-hrms.git
cd dayflow-hrms
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Use `.env.example` as the template:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit `.env` to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Then open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## 🗄️ Supabase Setup

The repository contains the database-related resources inside:

```text
supabase/
```

This includes:

- Database migrations
- Seed/demo data

Apply the required migrations to your Supabase project before using the complete backend functionality.

The repository also contains backend and verification documentation inside:

```text
docs/
```

---

## 🔑 Demo Access

The application includes separate demo experiences for:

### Employee

**Demo Employee:** Arjun Kumar

### HR

**Demo HR:** Priya Sharma

> Do not publish real passwords or private credentials in this repository. Configure authentication credentials through environment variables and your Supabase project.

---

## 📸 Screenshots

### Employee Dashboard

The employee dashboard provides an overview of working hours, attendance, leave balance, pending requests and other employee actions.

### HR Workforce Pulse

The HR dashboard provides organization-wide visibility into employees, attendance, leave and pending HR actions.

### Employee Attendance

Attendance includes attendance rate, present days, leave/absence information and a monthly calendar.

### Leave Management

Employees can apply for leave and track request status, while HR can review, approve or reject requests.

### Payroll

Employees can view salary, deductions, net pay and payroll history. HR can manage payroll records and payroll runs.

### Reports & Analytics

HR can review attendance trends, leave utilization, headcount, turnover and open positions.

### Notifications & Announcements

Employees can receive HR, payroll, attendance and company announcements.

### Audit Logs

HR administrators can review security and operational activity logs.

---

## 🔒 Important Security Notes

Never commit the following files or directories:

```text
.env
node_modules/
.vite/
```

The `.env` file may contain credentials or project configuration that should remain private.

Only use public/client-safe Supabase credentials in frontend environment variables, and never expose a Supabase service-role key in browser code.

---

## 🧪 Verification

The project includes documentation for backend and security verification:

```text
docs/SECURITY_TESTS.md
docs/VERIFICATION.md
```

Use these documents when testing the application before production deployment.

---

## 📈 Future Improvements

Possible future enhancements include:

- Advanced HR analytics
- Automated payroll processing
- Email notifications
- Attendance regularization workflow
- Employee onboarding workflow
- Advanced role and permission management
- File storage integration
- AI-powered HR assistant
- Mobile-friendly PWA support
- Automated report generation

---

## 👨‍💻 Author

**Yugang Gaurav**

B.Tech Computer Science & Engineering — AI & Machine Learning

GitHub:  
https://github.com/yuganggaurav

Live Project:  
https://yuganggaurav.github.io/dayflow-hrms/

---

## 📄 License

This project is developed for educational, portfolio and demonstration purposes.
