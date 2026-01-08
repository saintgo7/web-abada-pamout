# API 설계 문서
**프로그램 포트폴리오 관리 시스템**

## 1. API 개요
- **프로토콜**: HTTPS
- **포맷**: JSON
- **인증**: JWT Bearer Token

## 2. 주요 엔드포인트

### 인증 (/api/auth)
- POST /login - 로그인
- POST /logout - 로그아웃
- POST /refresh - 토큰 갱신
- GET /me - 내 정보 조회

### 프로그램 (/api/programs)
- GET / - 프로그램 목록
- GET /:id - 프로그램 상세
- POST / - 프로그램 생성
- PUT /:id - 프로그램 수정
- DELETE /:id - 프로그램 삭제

### 프로젝트 (/api/projects)
- GET / - 프로젝트 목록
- GET /:id - 프로젝트 상세
- POST / - 프로젝트 생성
- PUT /:id - 프로젝트 수정
- DELETE /:id - 프로젝트 삭제

### 리소스 (/api/resources)
- GET / - 리소스 목록
- POST /allocate - 리소스 할당
- PUT /:id - 리소스 수정
- DELETE /:id - 리소스 삭제

## 3. 응답 포맷

### 성공 (200)
```json
{
  "success": true,
  "data": { ... }
}
```

### 에러 (4xx, 5xx)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

## 4. 속도 제한
- 일반: 100 req/min
- Webhook: 1000 req/min

© 2025 ABADA Inc.
