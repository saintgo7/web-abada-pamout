# Deployment Plan Document
**Program Portfolio Management System**

## 1. CI/CD Pipeline
1. Push → Lint → Test → Build → Docker Image → Push to Registry

2. Auto-deploy to dev (all PRs)
3. Auto-deploy to staging (main branch)
4. Manual deploy to prod (after approval)

## 2. Environments
- dev: Development & testing
- staging: Pre-production
- prod: Live service

## 3. Strategy
- Blue-Green Deployment
- Zero downtime target
- Instant rollback

© 2025 ABADA Inc.
