# API Design Document
**Program Portfolio Management System**

## 1. Endpoints
- POST /api/auth/login
- GET/POST/PUT/DELETE /api/programs
- GET/POST/PUT/DELETE /api/projects
- GET/POST/PUT/DELETE /api/resources

## 2. Response Format
Success: { success: true, data: {...} }
Error: { success: false, error: {...} }

## 3. Rate Limiting
- 100 req/min (general)
- 1000 req/min (webhooks)

© 2025 ABADA Inc.
