# Database Design Document
**Program Portfolio Management System**

## 1. Overview
- PostgreSQL 16+, UTF-8, UTC

## 2. Main Tables
- users (id, email, name, role)
- programs (id, name, status, dates)
- projects (id, program_id, name)
- resources (id, user_id, project_id, allocation)

## 3. Indexes
- users.email (UNIQUE)
- programs.status
- resources.user_id, resources.project_id

© 2025 ABADA Inc.
