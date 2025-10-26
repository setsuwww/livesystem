# Information System Shift Management  
_A modern shift and attendance management system built with Next.js, Shadcn/UI, and MySQL._

---

## Overview

**Information System Shift Management** adalah aplikasi web yang dirancang untuk membantu perusahaan dalam mengatur jadwal kerja, manajemen shift, dan kehadiran karyawan secara efisien.  
Sistem ini dibuat dengan **Next.js (App Router)** di sisi frontend/backend, menggunakan **Shadcn/UI** untuk komponen antarmuka yang elegan, dan **MySQL** sebagai basis data utama.

---

## Tech Stack

| Layer | Technology |
|:------|:------------|
| **Frontend & Backend** | [Next.js 14+](https://nextjs.org/) (Fullstack React Framework) |
| **UI Components** | [Shadcn/UI](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| **Database** | [MySQL](https://www.mysql.com/) with [Prisma ORM](https://www.prisma.io/) |
| **Authentication** | JSON Web Token (JWT) |
| **Icons** | [Lucide Icons](https://lucide.dev/) |
---

## Features

✅ **Role-based Access Control**  
Admin
Employee
User  

✅ **Shift Scheduling System**  
Auto Scheduling System

✅ **Attendance Tracking**  
Views Attedance in detail in 1 page, or by-user 

✅ **Employee Dashboard**  
Personal Dashboard for daily activity
Personal fast action for attedance 

---

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/shift-management-system.git
cd shift-management-system
```

## 2. Installation
```bash
npm install
# or
pnpm install
# or
yarn install
# or 
bun install
```

### 3. Setup Environtment
DATABASE_URL="mysql://username:password@localhost:3306/your_db_name"
JWT_SECRET="your-secret-key"

## 4. Run Application
```bash
npm run dev
# or
pnpm run dev
# or
yarn run dev
# or 
bun run dev
```