# Technical Requirements Document
**Program Portfolio Management System**

## 1. Tech Stack
- Frontend: React 19, TypeScript 5.8, Material-UI
- Backend: Node.js 22, Express, Prisma
- Database: PostgreSQL 16, Redis

## 2. Architecture
- Microservices: Program, Resource, Budget, Risk, Auth
- API Gateway: Kong
- Event Bus: Redis Pub/Sub

## 3. Performance
- API Response: < 200ms (p95)
- Concurrent Users: 10,000

## 4. Security
- SSO (SAML 2.0, OIDC)
- TLS 1.3, AES-256
- RBAC

© 2025 ABADA Inc.
