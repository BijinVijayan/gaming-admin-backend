# 🎰 Gaming Platform Admin Ecosystem (Backend)

> **Technical Task Submission**  
> **Role:** Full-Stack Developer  
> **Stack:** NestJS, PostgreSQL, Prisma, Docker

---

## 📖 Project Overview

This repository contains the backend architecture for a scalable **iGaming Admin System**.

Unlike standard implementations that separate "Agent" and "Affiliate" logic into different silos, I have implemented a **Unified Partner Architecture**. This allows the system to handle both **Candidate A (Agent Panel)** and **Candidate B (Affiliate Panel)** requirements within a single, modular codebase.

### Key Features Implemented

* ** Secure Authentication:** JWT-based stateless auth with Bcrypt password hashing
* ** Role-Based Access Control (RBAC):** Distinct Guards for `AGENT` and `AFFILIATE`
* ** Financial Ledger:** Atomic transactions for wallet updates and withdrawals (ACID compliant)
* ** Agent Module:** User management, commission calculation simulation, and withdrawal requests
* ** Affiliate Module:** Unique tracking links, click logging (IP capture), and conversion analytics
* ** Auto-Documentation:** Interactive Swagger UI

---

##  Tech Stack

| Component | Technology | Reason for Choice |
|:---|:---|:---|
| **Framework** | **NestJS** | Modular architecture, strict TypeScript support, and enterprise-grade scalability |
| **Database** | **PostgreSQL** | Relational integrity is critical for financial/commission data |
| **ORM** | **Prisma** | Type-safe database queries and automated migrations |
| **Infrastructure** | **Docker** | Containerized database for consistent development environments |
| **Documentation** | **Swagger** | Interactive API testing and documentation |

---

##  Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18+)
* Docker & Docker Desktop

### 1. Clone the Repository

```bash
git clone https://github.com/BijinVijayan/gaming-admin-backend.git
cd gaming-admin-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Connection (Docker)
DATABASE_URL="postgresql://admin:admin123@localhost:5432/gaming_platform?schema=public"

# Security
JWT_SECRET="super_secret_dev_key"
```

### 4. Docker Configuration

The `docker-compose.yml` file is already configured:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    container_name: gaming_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: gaming_platform
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 5. Start Infrastructure

Run the following command to spin up the PostgreSQL database container:

```bash
docker-compose up -d
```

Verify the database is running:

```bash
docker ps
```

### 6. Initialize Database

Push the Prisma schema to the database:

```bash
npx prisma db push
```

To view the database in Prisma Studio (optional):

```bash
npx prisma studio
```

### 7. Run the Server

Start the development server:

```bash
npm run start:dev
```

The API will be available at: **http://localhost:3000/api**

---

## 📚 API Documentation

I have included Swagger for full interactive documentation. Once the server is running, visit:

👉 **http://localhost:3000/docs**

Here you can:
- Explore all available endpoints
- Test API requests directly
- View request/response schemas
- Authenticate and test protected routes

---

## 🔑 Key Modules

### Authentication Module
- JWT token generation and validation
- Password hashing with Bcrypt
- Role-based guards (`@Roles()` decorator)

### Agent Module
- User management under agents
- Commission calculation engine
- Withdrawal request handling

### Affiliate Module
- Unique tracking link generation
- Click tracking with IP capture
- Conversion analytics dashboard
---
