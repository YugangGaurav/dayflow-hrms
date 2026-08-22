# DAYFLOW HRMS

A modern, full-stack **Human Resource Management System (HRMS)** designed to manage employee information, attendance, leave, payroll, documents, notifications, announcements, reports, and HR operations from a single web application.

## 🚀 Live Demo

**DAYFLOW HRMS:**  
https://yuganggaurav.github.io/dayflow-hrms/

---

## 📌 Overview

DAYFLOW is a role-based HR management platform with dedicated experiences for:

- 👨‍💼 Employees
- 🧑‍💼 HR / Administrators

The application provides a centralized interface for common HR workflows including workforce monitoring, employee management, attendance, leave approvals, payroll, analytics, announcements, notifications, documents, and audit activity.

The frontend is built with modern web technologies and uses **Supabase** for authentication and backend data services.

---

## ✨ Features

### 👨‍💼 Employee Portal

- My Workday dashboard
- Check-in and working-duration view
- Attendance tracking and monthly calendar
- Attendance history
- Leave balance
- Apply for leave
- Leave request history and approval status
- Payroll and payslip information
- Payroll history
- Employee profile
- Job information
- Employment documents
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
- Headcount and turnover insights
- Open positions overview
- Company Announcements
- Audit Logs
- HR action monitoring

### 🔐 Security & Data

- Role-based Employee / HR access
- Supabase authentication
- Database-backed HR records
- Protected environment configuration
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
| Git & GitHub | Version control |
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
├── .env
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
└── node_modules/
```

> `node_modules/` and `.env` should **not** be committed to GitHub.

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

Create a `.env` file in the project root using `.env.example` as the template:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do **not** commit `.env` to GitHub.

### 4. Run the development server

```bash
npm run dev
```

Open the local URL provided by Vite, normally:

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

Database-related resources are located inside:

```text
supabase/
```

The project includes:

- Database migrations
- Seed/demo data
- Supabase configuration

Apply the required migrations to your Supabase project before using the complete backend functionality.

Additional backend, security and verification documentation is available inside:

```text
docs/
```

---

## 🔑 Demo Access

The application provides separate demo experiences:

### Employee

**Arjun Kumar** — Software Engineer

### HR

**Priya Sharma** — HR Administrator

> Do not publish real passwords or private credentials in the repository. Configure authentication credentials through your Supabase project and environment variables.

---

# 📸 Screenshots

## 🔐 Login

![DAYFLOW Login](Screenshot%202026-08-22%20161150%281%29.png)

---

# 👨‍💼 HR Administration

## Workforce Pulse

![Workforce Pulse](Screenshot%202026-08-22%20161413%281%29.png)

The HR command center provides organization-wide visibility into employees, attendance, leave and pending HR actions.

## Employees

![Employees](Screenshot%202026-08-22%20161423%281%29.png)

Employee directory with employee ID, department, job title, employment type, status and joining date.

## Leave Management

![Leave Management](Screenshot%202026-08-22%20161435%281%29.png)

HR can review pending leave requests and approve or reject employee requests.

## Payroll Management

![Payroll Management](Screenshot%202026-08-22%20161449%281%29.png)

Payroll dashboard showing monthly payroll, published payroll records, deductions, net pay and payroll status.

## Reports & Analytics

![Reports and Analytics](Screenshot%202026-08-22%20161502%281%29.png)

HR analytics covering attendance trends, leave utilization, headcount, turnover and open positions.

## Announcements

![Announcements](Screenshot%202026-08-22%20161514%281%29.png)

HR can publish company-wide announcements with audience and expiry controls.

## Audit Logs

![Audit Logs](Screenshot%202026-08-22%20161525%281%29.png)

Security and compliance history showing HR actions, actors, timestamps, entities and activity details.

---

# 👨‍💻 Employee Portal

## My Workday

![My Workday](Screenshot%202026-08-22%20161227%281%29.png)

Employee dashboard showing current work duration, check-in time, expected checkout, leave balance, pending requests and attendance rate.

## My Profile

![My Profile](Screenshot%202026-08-22%20161240%281%29.png)

Employee profile containing personal information, employee ID, job information, employment type, manager, location and work mode.

## Attendance

![Attendance](Screenshot%202026-08-22%20161252%281%29.png)

Monthly attendance calendar with present, leave and absent status, along with attendance statistics.

## Leave & Time Off

![Leave and Time Off](Screenshot%202026-08-22%20161302%281%29.png)

Employees can apply for leave, select dates and reasons, check remaining balances and track previous requests.

## Payroll

![Employee Payroll](Screenshot%202026-08-22%20161317%281%29.png)

Employees can view gross salary, deductions, net pay, pay date, payslips and payroll history.

## My Documents

![My Documents](Screenshot%202026-08-22%20161329%281%29.png)

Secure document area for employment, identity and salary-related documents.

## Notifications

![Notifications](Screenshot%202026-08-22%20161341%281%29.png)

Centralized employee notifications for leave approvals, payroll updates, system maintenance and announcements.

## DAYFLOW Copilot

![DAYFLOW Copilot](Screenshot%202026-08-22%20161400%281%29.png)

A workplace assistant interface designed to provide employees with quick access to workday-related information.

---

## 🔒 Important Security Notes

Never commit the following:

```text
.env
node_modules/
.vite/
```

The `.env` file can contain project configuration and must remain private.

Only use public/client-safe Supabase credentials in frontend environment variables. Never expose a Supabase service-role key in browser-side code.

---

## 🧪 Verification

The repository includes dedicated verification and security documentation:

```text
docs/SECURITY_TESTS.md
docs/VERIFICATION.md
```

These documents can be used to verify application functionality and security-related behavior before deployment.

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

B.Tech Computer Science & Engineering — Artificial Intelligence & Machine Learning

**GitHub:**  
https://github.com/yuganggaurav

**Live Project:**  
https://yuganggaurav.github.io/dayflow-hrms/

---

## 📄 License

This project is developed for educational, portfolio and demonstration purposes.
