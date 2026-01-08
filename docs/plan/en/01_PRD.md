# Product Requirements Document (PRD)
## Program Portfolio Management System (PPMS)

---

## Document Information

| Field | Content |
|-------|---------|
| **Version** | 1.0.0 |
| **Date** | 2025-01-08 |
| **Author** | ABADA Inc. Product Planning Team |
| **Revision History** | 2025-01-08: Initial draft |
| **Approvers** | CEO, CTO, Head of Product |
| **Distribution** | Executives, Engineering, Design, QA |

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Market Analysis](#2-market-analysis)
3. [User Personas](#3-user-personas)
4. [Product Vision & Goals](#4-product-vision--goals)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Stories & Use Cases](#7-user-stories--use-cases)
8. [UI/UX Requirements](#8-uiux-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Go-to-Market Strategy](#10-go-to-market-strategy)

---

## 1. Product Overview

### 1.1 Product Definition

The Program Portfolio Management System (PPMS) is a cloud-based enterprise software that enables organizations to efficiently manage multiple projects and programs. It provides a comprehensive solution covering the entire program management lifecycle, including resource allocation, budget tracking, schedule management, risk management, and stakeholder communication.

### 1.2 Problem Statement

**Challenges organizations face:**
- Resource conflicts across projects causing efficiency loss
- Difficulty in real-time program status visibility
- Human errors from manual resource allocation
- Budget overruns discovered too late for corrective action
- Lack of dependency management across programs
- Absence of real-time KPI dashboards for executives

### 1.3 Our Solution

PPMS provides the following solutions:
- **Centralized Portfolio View**: Unified control of all programs and projects
- **Intelligent Resource Optimization**: AI-based resource recommendations and allocation
- **Real-time Budget Tracking**: Monitoring budget consumption with alerts
- **Comprehensive Risk Management**: Risk identification, assessment, and mitigation planning
- **Automated Reporting**: Customizable dashboards and reports

### 1.4 Target Market

**Primary Target:**
- Mid-to-large enterprises (100-5,000 employees)
- IT/Software development organizations
- Consulting and SI companies
- Government and public agencies

**Secondary Target:**
- Startups (Series B and above)
- Educational institutions (universities, research institutes)
- Non-profit organizations

---

## 2. Market Analysis

### 2.1 Market Size

Global Project Portfolio Management (PPM) market:
- 2024: $4.5 billion
- 2029 projected: $8.5 billion
- CAGR: 13.5%

### 2.2 Competitive Landscape

**Key Competitors:**
1. **Atlassian (Jira, Portfolio for Jira)**
   - Strengths: Strong issue tracking, widespread ecosystem
   - Weaknesses: Weak portfolio features, complex setup

2. **Microsoft (Project Online, Azure DevOps)**
   - Strengths: Office 365 integration, enterprise stability
   - Weaknesses: High cost, poor user experience

3. **Planview (Enterprise One)**
   - Strengths: Professional portfolio management, powerful reporting
   - Weaknesses: Very high cost, long implementation time

4. **Monday.com**
   - Strengths: Intuitive UI, quick onboarding
   - Weaknesses: Lacks enterprise features

### 2.3 Our Competitive Advantages

| Aspect | Advantage |
|--------|-----------|
| **Usability** | Intuitive UI/UX, onboarding in under 1 hour |
| **AI Features** | Intelligent resource recommendations, risk prediction |
| **Pricing** | 40% lower than competitors |
| **Integration** | Native integration with major tools (Slack, Teams, Jira) |
| **Korean Support** | Native Korean UI, local support |

---

## 3. User Personas

### 3.1 Executive (C-Level)

**Name:** Kim Min-su, CTO
**Age:** 48
**Role:** Chief Technology Officer
**Goals:**
- Real-time visibility into all programs
- ROI analysis
- Strategic decision-making support

**Pain Points:**
- Information silos preventing holistic view
- Tedious weekly/monthly report generation
- Difficulty identifying resource bottlenecks quickly

**Key Requirements:**
- Intuitive dashboards
- One-click reporting
- Mobile app support

### 3.2 Program Manager

**Name:** Lee Su-jin, Senior Manager
**Age:** 36
**Role:** Managing multiple projects
**Goals:**
- Optimize resource allocation across projects
- Manage dependencies
- Achieve program objectives

**Pain Points:**
- Inaccuracy of Excel-based resource spreadsheets
- Difficulty detecting team member overload
- Tedious stakeholder-specific reporting

**Key Requirements:**
- Gantt charts and schedule management
- Resource roadmaps
- Customizable dashboards

### 3.3 Project Manager

**Name:** Park Jun-hyeok, Manager
**Age:** 32
**Role:** Managing single project
**Goals:**
- Meet project deadlines
- Improve team communication
- Track and manage tasks

**Pain Points:**
- Complexity of sharing resources with other projects
- Lack of workload visualization
- Inconvenient issue and risk tracking

**Key Requirements:**
- Kanban/scrum boards
- Time tracking
- Issue management

### 3.4 Team Member

**Name:** Jeong Ji-won, Associate
**Age:** 28
**Role:** Developer
**Goals:**
- Clear understanding of assigned tasks
- Record work hours
- Collaborate with team

**Pain Points:**
- Ambiguity about what to work on
- Preventing duplicate work
- Tedious progress sharing

**Key Requirements:**
- Clear task list
- Easy time tracking
- Team chat and notifications

---

## 4. Product Vision & Goals

### 4.1 Product Vision

> "To create a world where every organization can manage their programs data-driven,
> and team members can focus on their creative work."

### 4.2 Mission

1. **Democratize Program Management**: Provide tools anyone can use easily
2. **Data-Driven Decision Making**: Support efficient decisions with real-time insights
3. **Automate Team Workflows**: Automate repetitive tasks to focus on creative work

### 4.3 Key Goals (2025)

**Users:**
- Acquire 100 paid enterprise customers
- Achieve 10,000 Monthly Active Users (MAU)
- Maintain retention rate above 85%

**Revenue:**
- Achieve $2M Annual Recurring Revenue (ARR)
- Average Revenue Per User (ARPU) of $1,600/month
- Churn rate below 10%

**Product:**
- Release 100% of core features
- Maintain 99.9% platform uptime
- Achieve Net Promoter Score (NPS) above 50

---

## 5. Functional Requirements

### 5.1 Portfolio Dashboard (Must Have)

**Requirement ID:** REQ-DASH-001
**Priority:** P0

**Description:**
Provide dashboard for executives and program managers to view all program status at a glance

**Key Features:**
- Program progress visualization (pie/bar charts)
- Resource utilization status (heat map)
- Budget consumption rate (gauge chart)
- Risk level display (traffic light: green/yellow/red)
- Milestone tracking (timeline)
- KPI metrics (table)

**Required Views:**
- Overall portfolio view
- Program-specific detail view
- Personalized view (drag-and-drop widgets)

**Data Refresh:**
- Automatic: Every 5 minutes
- Manual: Refresh button

---

### 5.2 Resource Management (Must Have)

**Requirement ID:** REQ-RES-001
**Priority:** P0

**Key Features:**
- **Resource Pool Management**
  - Team member registration (name, role, skills, availability)
  - Skill tags (Java, Python, Design, PM, etc.)
  - Availability setting (xx hours per week)

- **Resource Allocation**
  - Assign team members to projects
  - Set allocation percentage (100%, 50%, 25%, etc.)
  - Duration setting (start~end date)
  - Drag-and-drop easy allocation

- **Resource Roadmap**
  - Timeline view of resource allocation
  - Automatic highlighting of overloaded team members (red)
  - Recommendations for open resource needs

- **Resource Analysis**
  - Utilization reports (by team member, by role)
  - Over/under utilization status
  - Skill gap analysis

---

### 5.3 Project/Program Management (Must Have)

**Requirement ID:** REQ-PROJ-001
**Priority:** P0

**Key Features:**
- **Hierarchy Structure**
  - Program > Project > Task
  - Up to 5 levels deep

- **Project Creation**
  - Basic info: name, description, owner, duration
  - Program linkage
  - Budget setting
  - Status: Planning/In Progress/Completed/On Hold/Cancelled

- **Task Management**
  - Create and assign tasks
  - Priority (P0~P3)
  - Progress (0~100%)
  - Milestone setting
  - Dependency setting (predecessor-successor)

- **Schedule Management**
  - Gantt chart view
  - Kanban board (To Do, In Progress, Done)
  - List view
  - Calendar view

- **Dependency Management**
  - Finish-to-Start (FS): B starts after A completes
  - Start-to-Start (SS): B starts after A starts
  - Finish-to-Finish (FF): B completes after A completes
  - Start-to-Finish (SF): B completes after A starts

---

### 5.4 Budget Management (Must Have)

**Requirement ID:** REQ-BUD-001
**Priority:** P0

**Key Features:**
- **Budget Setting**
  - Total project budget
  - Budget by category (personnel, equipment, outsourcing, etc.)
  - Annual/quarterly/monthly allocation

- **Cost Tracking**
  - Actual cost input
  - Automatic aggregation
  - Budget vs actual comparison

- **Budget Alerts**
  - Alerts at 80%, 90%, 100% consumption
  - Approval workflow for overages

- **Cost Reports**
  - Cost analysis by program
  - Breakdown by category
  - Trend charts

---

### 5.5 Risk Management (Should Have)

**Requirement ID:** REQ-RISK-001
**Priority:** P1

**Key Features:**
- **Risk Registration**
  - Risk name, description, category
  - Likelihood (1~5)
  - Impact (1~5)
  - Automatic priority calculation (likelihood × impact)

- **Risk Matrix**
  - X-axis: Likelihood
  - Y-axis: Impact
  - 4 quadrants (Low, Medium, High, Very High)

- **Mitigation Plan**
  - Response strategy (Avoid, Reduce, Transfer, Accept)
  - Owner, deadline
  - Status

- **Monitoring**
  - Review cycle setting
  - Notifications for level changes

---

### 5.6 Reporting & Analytics (Must Have)

**Requirement ID:** REQ-RPT-001
**Priority:** P0

**Key Features:**
- **Standard Reports**
  - Program status report
  - Resource utilization report
  - Budget execution report
  - Risk summary report

- **Custom Reports**
  - User-defined
  - Chart/graph selection
  - Filters and drill-down
  - Save and share

- **Scheduling**
  - Automatic weekly/monthly delivery
  - Email/PDF/Excel formats

- **Export**
  - PDF, Excel, CSV, Image

---

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Requirement | Measurement |
|--------|-------------|-------------|
| **Page Load** | Under 2 seconds initial load | Lighthouse |
| **Dashboard** | Data load under 1 second | Measurement tools |
| **API Response** | Average under 200ms | APM tools |
| **Concurrent Users** | Support 10,000 concurrent | Load testing |
| **Database** | Queries under 100ms | DB monitoring |

### 6.2 Security

| Aspect | Requirement |
|--------|-------------|
| **Authentication** | SSO (SAML 2.0, OpenID Connect), MFA support |
| **Authorization** | RBAC (Role-Based Access Control) |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest |
| **Audit** | Log all actions (minimum 1 year retention) |
| **Backup** | Daily automatic backup, geo-distributed |
| **Compliance** | ISO 27001, GDPR compliant |

### 6.3 Scalability

| Aspect | Requirement |
|--------|-------------|
| **Horizontal Scale** | Stateless app, auto-scaling |
| **Vertical Scale** | Up to 32 cores, 128GB RAM |
| **Database** | Read replicas, sharding support |
| **Storage** | Object storage (S3 compatible) |

### 6.4 Availability

| Metric | Target |
|--------|--------|
| **Uptime** | 99.9% (43 minutes downtime/month allowed) |
| **Disaster Recovery** | RPO 1 hour, RTO 4 hours |
| **Backup** | Daily full backup, hourly incremental |

---

## 7. User Stories & Use Cases

### 7.1 Executive: Portfolio Status Overview

**User Story:**
> As an executive, I want to see the status of all programs at a glance,
> so that I can make strategic decisions.

**Use Case:** UC-EXEC-001

1. Executive logs into the system
2. Portfolio dashboard is displayed
3. Executive views:
   - Total program count and status
   - Resource utilization
   - Budget consumption
   - Risk levels
   - Key KPIs
4. Clicks specific program for details
5. Downloads report as PDF if needed

**Success Criteria:**
- Dashboard loads in under 2 seconds
- All data real-time (maximum 5 minutes delay)
- One-click report download

---

### 7.2 Program Manager: Resource Allocation

**User Story:**
> As a program manager, I want to optimally allocate limited resources,
> so that I can complete all projects on time.

**Use Case:** UC-PM-001

1. Program manager opens resource roadmap view
2. Views current resource allocation
3. Overloaded team members shown in red
4. Identifies projects with resource gaps
5. Drags and drops team members to projects
6. System warns of conflicts (if already 100% allocated)
7. Finds appropriate team member and reallocates
8. Saves changes

**Success Criteria:**
- Automatic overload detection
- Real-time conflict warnings
- Intuitive drag-and-drop behavior

---

## 8. UI/UX Requirements

### 8.1 Design Principles

1. **Simplicity**
   - Ruthlessly omit information
   - Access all features within 3 clicks

2. **Consistency**
   - Same UI patterns throughout system
   - Unified terminology, colors, icons

3. **Feedback**
   - Immediate response for every action
   - Loading state indicators
   - Success/failure messages

4. **Accessibility**
   - WCAG 2.1 Level AA compliant
   - Keyboard navigation support
   - Color blind mode support

### 8.2 Layout

**Desktop:**
- Navigation: Left sidebar (collapsible)
- Main content: Center
- Right panel: Detail information (toggle)

**Mobile:**
- Bottom navigation bar
- Full-screen content
- Swipe gestures

### 8.3 Color System

| Purpose | Primary | Secondary |
|---------|---------|-----------|
| **Base** | #6366F1 (Indigo) | #8B5CF6 (Purple) |
| **Success** | #10B981 (Emerald) | - |
| **Warning** | #F59E0B (Amber) | - |
| **Danger** | #EF4444 (Red) | - |
| **Info** | #3B82F6 (Blue) | - |
| **Dark Mode** | #0F172A (background) | #1E293B (card) |

---

## 9. Success Metrics

### 9.1 Product Success Metrics

| Metric | Current | Target (2025 Q4) | Measurement |
|--------|---------|------------------|-------------|
| **Users** | 0 | 10,000 MAU | Google Analytics |
| **Paying Customers** | 0 | 100 companies | CRM |
| **Retention Rate** | - | 85% | Cohort analysis |
| **Feature Adoption** | - | Core 70% | Event tracking |
| **User Satisfaction** | - | NPS 50+ | Survey |

### 9.2 Business Success Metrics

| Metric | Current | Target (2025 Q4) | Measurement |
|--------|---------|------------------|-------------|
| **Revenue (ARR)** | ₩0 | ₩2B | Financial system |
| **CAC** | - | ₩500K | Marketing spend/new customers |
| **LTV** | - | ₩15M | Avg contract × ARPU |
| **LTV/CAC Ratio** | - | 3:1 | LTV ÷ CAC |
| **Conversion Rate** | - | 90% | Paid conversions/trial signups |

---

## 10. Go-to-Market Strategy

### 10.1 Phased Launch Plan

**Alpha - Internal Testing**
- Audience: ABADA Inc. internal teams
- Duration: 2 weeks
- Goal: Find major bugs, validate features

**Beta - Pilot Customers**
- Audience: 5 partner companies
- Duration: 4 weeks
- Goal: Real-world testing, collect feedback

**GA - General Availability**
- Audience: General customers
- Timeline: Q1 2025
- Goal: Market launch, customer acquisition

### 10.2 Pricing Strategy

**Editions:**

| Edition | Price (month/user) | Features |
|---------|-------------------|----------|
| **Starter** | ₩50,000 | Basic PM, up to 10 users |
| **Professional** | ₩100,000 | Advanced PM, resources, budget |
| **Enterprise** | Contact | SSO, on-premise, dedicated support |

**Discounts:**
- Annual billing: 20% off
- Non-profit: 50% off
- Startup: 30% off (under 3 years)

**Free Trial:**
- Duration: 30 days
- Features: Full Professional edition
- Credit card not required

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Program** | Collection of related projects managed together to achieve a single objective |
| **Project** | Effort with clear start and end, creating specific deliverables |
| **Portfolio** | Set of programs/projects managed to achieve organizational strategic goals |
| **Milestone** | Significant point or event in a project |
| **Dependency** | Predecessor-successor relationship between tasks |
| **Gantt Chart** | Bar chart displaying project schedule |
| **Kanban** | Method to visualize work and manage flow |

---

## Appendix B: Related Documents

**Related Docs:**
- [02_TRD.md](./02_TRD.md) - Technical Requirements Document
- [03_UIX_Design.md](./03_UIX_Design.md) - UI/UX Design Document
- [06_Architecture_Design.md](./06_Architecture_Design.md) - Architecture Design Document

**External References:**
- PMBOK 7th Edition (Project Management Institute)
- The Standard for Portfolio Management (PMI)
- ISO 21500: Guidance on project management

---

**End of Document**

© 2025 ABADA Inc. All rights reserved.
