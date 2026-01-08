# 데이터베이스 설계 문서
**프로그램 포트폴리오 관리 시스템**

## 1. 데이터베이스 개요
- **DBMS**: PostgreSQL 16+
- **문자셋**: UTF-8
- **Timezone**: UTC

## 2. 주요 테이블

### users (사용자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| email | VARCHAR(255) | UNIQUE |
| name | VARCHAR(100) | |
| password_hash | VARCHAR(255) | |
| role | VARCHAR(50) | |

### programs (프로그램)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| name | VARCHAR(255) | |
| description | TEXT | |
| status | VARCHAR(50) | |
| start_date | DATE | |
| end_date | DATE | |

### projects (프로젝트)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| program_id | UUID | FK → programs |
| name | VARCHAR(255) | |
| status | VARCHAR(50) | |

### resources (리소스)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | PK |
| user_id | UUID | FK → users |
| project_id | UUID | FK → projects |
| allocation_percent | INTEGER | |
| start_date | DATE | |
| end_date | DATE | |

## 3. 인덱스
- users.email (UNIQUE)
- programs.status
- projects.program_id
- resources.user_id, resources.project_id

## 4. 마이그레이션 전략
- 버전 관리: 숫자차 버전 (001, 002, ...)
- 롤백 지원
- 마이그레이션 로그 저장

© 2025 ABADA Inc.
