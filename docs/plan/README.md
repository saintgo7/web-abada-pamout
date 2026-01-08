# Program Portfolio Management System
## Comprehensive Documentation (프로그램 포트폴리오 관리 시스템 종합 문서)

---

## Overview (개요)

This documentation package provides comprehensive planning and design specifications for a Program Portfolio Management System (PPMS). The system enables organizations to manage multiple projects, allocate resources efficiently, track budgets, and monitor progress across their entire program portfolio.

본 문서 패키지는 프로그램 포트폴리오 관리 시스템(PPMS)의 포괄적인 계획 및 설계 사양을 제공합니다. 이 시스템을 통해 조직은 여러 프로젝트를 관리하고, 리소스를 효율적으로 할당하며, 예산을 추적하고, 전체 프로그램 포트폴리오의 진행 상황을 모니터링할 수 있습니다.

---

## Document Structure (문서 구조)

### 📁 `/ko/` - Korean Documents (한국어 문서)

### 📁 `/en/` - English Documents (영어 문서)

### 📁 `/scripts/` - Conversion Scripts (변환 스크립트)

---

## Document Index (문서 목차)

### Core Development Documents (핵심 개발 문서)

| # | Document | 한국어 제목 | Description |
|---|----------|-----------|-------------|
| 01 | [PRD](./ko/01_PRD.md) | 제품 요구사항 문서 | Product vision, features, requirements |
| 02 | [TRD](./ko/02_TRD.md) | 기술 요구사항 문서 | Technology stack, performance, scalability |
| 03 | [UI/UX Design](./ko/03_UIX_Design.md) | UI/UX 설계 문서 | User interface, experience, components |
| 04 | [Database Design](./ko/04_Database_Design.md) | 데이터베이스 설계 문서 | Schema, ERD, migrations, indexing |
| 05 | [API Design](./ko/05_API_Design.md) | API 설계 문서 | RESTful endpoints, authentication, versioning |
| 06 | [Architecture Design](./ko/06_Architecture_Design.md) | 아키텍처 설계 문서 | System architecture, components, security |
| 07 | [Test Plan](./ko/07_Test_Plan.md) | 테스트 계획 문서 | Testing strategy, scenarios, coverage |
| 08 | [Deployment Plan](./ko/08_Deployment_Plan.md) | 배포 계획 문서 | CI/CD, environments, monitoring |
| 09 | [Project Schedule](./ko/09_Project_Schedule.md) | 프로젝트 일정 문서 | Timeline, milestones, resources |

### Business Documents (비즈니스 문서)

| # | Document | 한국어 제목 | Description |
|---|----------|-----------|-------------|
| 10 | [Business Plan](./ko/10_Business_Plan.md) | 사업계획서 | Market analysis, revenue model, growth |
| 11 | [Feasibility Study](./ko/11_Feasibility_Study.md) | 타당성 조사 | Technical, economic, operational analysis |

### Operations Documents (운영 문서)

| # | Document | 한국어 제목 | Description |
|---|----------|-----------|-------------|
| 12 | [Operations Manual](./ko/12_Operations_Manual.md) | 운영매뉴얼 | System administration, maintenance |
| 13 | [User Guide](./ko/13_User_Guide.md) | 사용자 가이드 | Tutorials, workflows, best practices |

### Quality Documents (품질 문서)

| # | Document | 한국어 제목 | Description |
|---|----------|-----------|-------------|
| 14 | [Code Review Guide](./ko/14_Code_Review_Guide.md) | 코드리뷰 가이드 | Standards, checklist, workflows |
| 15 | [Security & Performance Guide](./ko/15_Security_Performance_Guide.md) | 보안 및 성능 가이드 | Best practices, optimization, compliance |

---

## Quick Start Guide (빠른 시작)

### View Documentation (문서 보기)

Simply navigate to the respective language folder and open any markdown file:

원하는 언어 폴더로 이동하여 마크다운 파일을 열면 됩니다:

```bash
# Korean documents (한국어 문서)
cd docs/plan/ko/
open 01_PRD.md

# English documents (영어 문서)
cd docs/plan/en/
open 01_PRD.md
```

### Convert to DOCX (DOCX로 변환)

#### Prerequisites (전제 조건)

```bash
# Install Pandoc
# macOS
brew install pandoc

# Linux
sudo apt-get install pandoc

# Windows (using Chocolatey)
choco install pandoc
```

#### Convert Single File (단일 파일 변환)

```bash
# From project root (프로젝트 루트에서)
cd docs/plan
bash scripts/convert_to_docx.sh ko/01_PRD.md
```

#### Convert All Documents (모든 문서 변환)

```bash
# Convert all Korean documents (모든 한국어 문서 변환)
cd docs/plan
bash scripts/convert_all.sh ko

# Convert all English documents (모든 영어 문서 변환)
bash scripts/convert_all.sh en
```

Output files will be created in `docs/plan/output/` folder.

출력 파일은 `docs/plan/output/` 폴더에 생성됩니다.

---

## Key Features of PPMS (시스템 핵심 기능)

### 1. Portfolio Dashboard (포트폴리오 대시보드)
- Real-time overview of all programs and projects
- KPIs and metrics visualization
- Executive reporting

### 2. Resource Management (리소스 관리)
- Team member allocation
- Workload balancing
- Skill-based assignment

### 3. Budget Management (예산 관리)
- Financial planning and forecasting
- Cost tracking by project
- Budget variance analysis

### 4. Risk Management (위험 관리)
- Risk identification and assessment
- Mitigation planning
- Impact analysis

### 5. Timeline Management (일정 관리)
- Gantt charts
- Milestone tracking
- Dependency management

### 6. Reporting & Analytics (보고 및 분석)
- Custom report builder
- Data visualization
- Export capabilities

### 7. Stakeholder Management (이해관계자 관리)
- Stakeholder mapping
- Communication tracking
- Access control

### 8. Document Management (문서 관리)
- Central repository
- Version control
- Collaboration tools

---

## User Roles (사용자 역할)

| Role (역할) | Description (설명) | Key Capabilities (주요 기능) |
|------------|-------------------|---------------------------|
| **Executive** (경영진) | Strategic oversight (전략적 감독) | Portfolio view, executive reports, high-level KPIs |
| **Program Manager** (프로그램 관리자) | Cross-program coordination (프로그램 간 조정) | Multi-project oversight, resource allocation, inter-project dependencies |
| **Project Manager** (프로젝트 관리자) | Individual project management (개별 프로젝트 관리) | Task management, team coordination, progress tracking |
| **Team Member** (팀원) | Task execution (작업 수행) | Task assignment, time tracking, status updates |
| **Stakeholder** (이해관계자) | Information access (정보 접근) | View-only access to relevant reports and progress |

---

## Technology Stack (기술 스택)

### Frontend (프론트엔드)
- **Framework**: React 19+ with TypeScript
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: Material-UI / Ant Design
- **Charts**: Recharts / Chart.js
- **Build Tool**: Vite

### Backend (백엔드)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js / NestJS
- **Database**: PostgreSQL + Redis
- **ORM**: Prisma / TypeORM
- **Authentication**: JWT + OAuth 2.0

### DevOps (데브옵스)
- **CI/CD**: GitHub Actions / GitLab CI
- **Container**: Docker + Kubernetes
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Cloud**: AWS / GCP / Azure

---

## Document Relationships (문서 관계도)

```
Business Plan (10)
       ↓
Feasibility Study (11) → PRD (01) → TRD (02)
                              ↓
                      Architecture (06)
                       /     |     \
                      ↓      ↓      ↓
                UI/UX (3)  DB (4)  API (5)
                      \      |      /
                       ↓     ↓     ↓
                    Test Plan (7)
                         ↓
                  Deployment (8)
                         ↓
                 Project Schedule (9)
                         ↓
                  Operations (12)
                         ↓
                   User Guide (13)

                 Code Review (14)
                 Security (15)
                    (Parallel)
```

---

## Conversion Scripts Details (변환 스크립트 상세)

### `convert_to_docx.sh`

Converts a single markdown file to DOCX format with:
- Automatic table of contents
- Korean font support (Noto Sans CJK)
- Code syntax highlighting
- Header/footer formatting
- Page numbers

### `convert_all.sh`

Batch converts all markdown files in a language folder:
- Preserves directory structure
- Creates output folder with timestamp
- Generates conversion log
- Supports parallel processing

### Customization (커스터마이징)

Edit the scripts to customize:
- Font families and sizes
- Color schemes
- Header/footer content
- TOC depth levels
- Code highlighting styles

---

## Contributing (기여)

When updating documentation:

1. Update both Korean and English versions
2. Maintain consistent formatting
3. Update document version numbers
4. Add change notes to document metadata
5. Test conversion scripts after changes

---

## Document Versioning (문서 버전관리)

- **Current Version**: 1.0.0
- **Last Updated**: 2025-01-08
- **License**: Internal Use Only

---

## Contact (연락처)

For questions or feedback about this documentation:

**ABADA Inc.**
- Website: https://abada.com
- Email: docs@abada.com

---

**Generated with Claude Code** | © 2025 ABADA Inc. All rights reserved.
