# Architecture Design Document
**Program Portfolio Management System**

## 1. System Architecture
```
Client (React)
    ↓
API Gateway
    ↓
Microservices (Program, Resource, Budget, Risk, Auth)
    ↓
PostgreSQL (Master + Replicas) + Redis
```

## 2. Data Flow
- Read: Gateway → Service → Read Replica
- Write: Gateway → Service → PostgreSQL → Event Bus

## 3. Security
- VPC, Private Subnet
- JWT + MFA
- TLS 1.3, AES-256

© 2025 ABADA Inc.
