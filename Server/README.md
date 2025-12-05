# 전시 Backend

전시는 기업과 전문가를 연결하는 플랫폼의 백엔드 API 서버입니다. NestJS, Prisma, PostgreSQL을 기반으로 구축되었습니다.

## 🚀 기술 스택

- **Framework**: NestJS 10.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## 📋 요구사항

- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm 또는 yarn

## 🛠️ 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값들을 설정합니다.

```bash
cp .env.example .env
```

주요 환경 변수:
- `DATABASE_URL`: PostgreSQL 연결 URL
- `JWT_SECRET`: JWT 토큰 서명용 비밀키
- `PORT`: 서버 포트 (기본값: 3001)

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시드 데이터 삽입 (선택사항)
npx prisma db seed
```

### 4. 서버 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

## 📚 API 문서

서버 실행 후 다음 URL에서 Swagger API 문서를 확인할 수 있습니다:

- 개발 환경: http://localhost:3001/api/docs
- API 엔드포인트: http://localhost:3001/api/v1

## 🏗️ 프로젝트 구조

```
src/
├── common/                 # 공통 모듈
│   ├── dto/               # 공통 DTO
│   ├── pipes/             # 커스텀 파이프
│   └── guards/            # 커스텀 가드
├── modules/               # 기능별 모듈
│   ├── auth/              # 인증 모듈
│   ├── users/             # 사용자 모듈
│   ├── experts/           # 전문가 모듈
│   └── companies/         # 기업 모듈
├── prisma/                # Prisma 설정
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.controller.ts      # 앱 컨트롤러
├── app.module.ts          # 루트 모듈
├── app.service.ts         # 앱 서비스
└── main.ts                # 애플리케이션 진입점
```

## 🔐 인증 시스템

### 사용자 역할 (UserRole)
- `COMPANY`: 기업 사용자
- `EXPERT`: 전문가 사용자

### 인증 플로우
1. 회원가입: `POST /api/v1/auth/register`
2. 로그인: `POST /api/v1/auth/login`
3. JWT 토큰을 Authorization 헤더에 포함하여 API 호출

## 📊 데이터베이스 스키마

### 주요 엔티티
- **User**: 사용자 기본 정보
- **Expert**: 전문가 프로필
- **Company**: 기업 프로필
- **Application**: 지원서
- **Schedule**: 일정 관리
- **Review**: 리뷰 시스템

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🔧 개발 도구

### 코드 품질
```bash
# ESLint 검사
npm run lint

# Prettier 포맷팅
npm run format
```

### 데이터베이스 관리
```bash
# Prisma Studio 실행
npx prisma studio

# 스키마 동기화
npx prisma db push

# 마이그레이션 생성
npx prisma migrate dev --name migration_name
```

## 🚀 배포

### Docker를 사용한 배포

```bash
# Docker 이미지 빌드
docker build -t jeonsi-backend .

# 컨테이너 실행
docker run -p 3001:3001 --env-file .env jeonsi-backend
```

### 환경별 설정
- **개발**: `.env`
- **테스트**: `.env.test`
- **프로덕션**: 환경 변수 또는 `.env.production`

## 📝 API 엔드포인트

### 인증 (Auth)
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/refresh` - 토큰 갱신

### 사용자 (Users)
- `GET /users` - 사용자 목록 조회
- `GET /users/:id` - 사용자 상세 조회
- `PATCH /users/:id` - 사용자 정보 수정
- `DELETE /users/:id` - 사용자 삭제

### 전문가 (Experts)
- `POST /experts` - 전문가 프로필 생성
- `GET /experts` - 전문가 목록 조회
- `GET /experts/search` - 전문가 검색
- `GET /experts/:id` - 전문가 상세 조회
- `PATCH /experts/:id` - 전문가 프로필 수정

### 기업 (Companies)
- `POST /companies` - 기업 프로필 생성
- `GET /companies` - 기업 목록 조회
- `GET /companies/search` - 기업 검색
- `GET /companies/:id` - 기업 상세 조회
- `PATCH /companies/:id` - 기업 프로필 수정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요.

---

**전시 Backend** - 전문가와 기업을 연결하는 플랫폼
