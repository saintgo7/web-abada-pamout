# 아키텍처 설계 문서
**프로그램 포트폴리오 관리 시스템**

## 1. 시스템 아키텍처

### 1.1 전체 구조
```
[클라이언트 (React)]
       ↓ HTTPS
[API Gateway (Kong)]
       ↓
[마이크로서비스들]
├─ 프로그램 서비스 (Node.js)
├─ 리소스 서비스 (Node.js)
├─ 보고 서비스 (Node.js)
└─ 인증 서비스 (Node.js)
       ↓
[데이터베이스 계층]
├─ PostgreSQL (마스터)
├─ PostgreSQL (레플리카 ×3)
└─ Redis (캐시)
```

## 2. 컴포넌트 상세

### 2.1 API Gateway
- **역할**: 라우팅, 인증, 속도 제한
- **기술**: Kong / AWS API Gateway

### 2.2 마이크로서비스
- **프로그램 서비스**: 프로그램/프로젝트 CRUD
- **리소스 서비스**: 리소스 관리, 할당
- **보고 서비스**: 리포트 생성
- **인증 서비스**: 사용자 인증, 권한

### 2.3 메시징
- **이벤트 버스**: Redis Pub/Sub
- **메시지 큐**: AWS SQS / RabbitMQ

## 3. 데이터 플로우

### 3.1 조회 요청
```
클라이언트 → Gateway → 서비스 → Read Replica → 클라이언트
```

### 3.2 쓰기 요청
```
클라이언트 → Gateway → 서비스 → PostgreSQL → Event Bus → 다른 서비스
```

## 4. 보안 아키텍처
- **네트워크**: VPC, Private Subnet
- **인증**: JWT + MFA
- **권한**: RBAC
- **암호화**: TLS 1.3, AES-256

© 2025 ABADA Inc.
