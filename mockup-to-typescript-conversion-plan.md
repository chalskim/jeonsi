# Mockup HTML → TypeScript 변환 계획

## 개요
mockup 폴더의 68개 HTML 파일을 TypeScript React 컴포넌트로 변환하여 `_frontServer/src` 폴더에 구현하는 계획

## 변환 규칙

### 1. 파일명 변환
- **원본**: `홈.html` → **변환**: `Home.tsx`
- **원본**: `마이페이지_개인.html` → **변환**: `MyPagePersonal.tsx`
- **원본**: `마이페이지_기업.html` → **변환**: `MyPageCorporate.tsx`
- **원본**: `단기 의뢰 목록.html` → **변환**: `ShortTermRequestsList.tsx`
- **원본**: `전문가 프로필 등록.html` → **변환**: `ExpertProfileRegistration.tsx`

### 2. 폴더 구조
```
_frontServer/src/
├── screen/
│   ├── home/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── singup.tsx
│   │   ├── NewsNoticeList.tsx
│   │   └── InquiryList.tsx
│   ├── shortTermRequests/
│   │   ├── ShortTermRequestsList.tsx
│   │   ├── ShortTermRequestsDetail.tsx
│   │   ├── ShortTermRequestsApplicants.tsx
│   │   ├── ShortTermRequestsApplicantsManagement.tsx
│   │   └── ShortTermRequestsInput.tsx
│   ├── experts/
│   │   ├── ExpertsList.tsx
│   │   ├── ExpertsDetail.tsx
│   │   └── ExpertsRegistration.tsx
│   ├── education/
│   │   ├── EducationList.tsx
│   │   ├── EducationDetail.tsx
│   │   ├── EducationRegistration.tsx
│   │   └── EducationStudents.tsx
│   ├── recruitment/
│   │   ├── RecruitmentList.tsx
│   │   ├── RecruitmentDetail.tsx
│   │   ├── RecruitmentApplicants.tsx
│   │   ├── RecruitmentInput.tsx
│   │   └── RecruitmentRegistration.tsx
│   ├── myPage/
│   │   ├── MyPagePersonal.tsx
│   │   ├── MyPageCorporate.tsx
│   │   ├── PersonalRegistrationEdit.tsx
│   │   └── CompanyRegistrationEdit.tsx
│   ├── payment/
│   │   ├── PaymentManagementPersonal.tsx
│   │   ├── PaymentManagementCorporate.tsx
│   │   ├── PaymentMethods.tsx
│   │   ├── ShoppingCartPersonal.tsx
│   │   └── ShoppingCartCorporate.tsx
│   ├── portfolio/
│   │   ├── PortfolioRegistration.tsx
│   │   ├── PortfolioList.tsx
│   │   └── PortfolioDetail.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── NewsManage.tsx
│   │   ├── InquiryManage.tsx
│   │   ├── UserListManagement.tsx
│   │   ├── PaymentManage.tsx
│   │   ├── SkillManage.tsx
│   │   ├── MatchingDashboard.tsx
│   │   ├── ExpertMatching.tsx
│   │   ├── ProjectMatching.tsx
│   │   ├── ExpertRecommendation.tsx
│   │   ├── ExpertVerification.tsx
│   │   ├── AdminSettings.tsx
│   │   ├── AdminReports.tsx
│   │   └── AdminAccountManagement.tsx
│   └── auth/
│       ├── RegistrationPersonal.tsx
│       └── RegistrationCompany.tsx
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   ├── forms/
│   │   ├── SearchForm.tsx
│   │   ├── FilterForm.tsx
│   │   └── RegistrationForm.tsx
│   └── cards/
│       ├── RecruitmentCard.tsx
│       ├── ExpertCard.tsx
│       └── NewsCard.tsx
├── hooks/
├── services/
├── types/
└── utils/
```

## 변환 매핑 표

### 메인 탭
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 홈.html | Home.tsx | screen/main/Home.tsx |
| 뉴스_공지.html | NewsNoticeList.tsx | screen/main/NewsNoticeList.tsx |
| 1대1_문의리스트.html | InquiryList.tsx | screen/main/InquiryList.tsx |

### 단기 의뢰
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 단기 의뢰 목록.html | ShortTermRequestsList.tsx | screen/shortTermRequests/ShortTermRequestsList.tsx |
| 단기 의뢰 상세.html | ShortTermRequestsDetail.tsx | screen/shortTermRequests/ShortTermRequestsDetail.tsx |
| 단기_의뢰_상세_지원자보기.html | ShortTermRequestsApplicants.tsx | screen/shortTermRequests/ShortTermRequestsApplicants.tsx |
| 단기의뢰상세_지원자판단.html | ShortTermRequestsApplicantsManagement.tsx | screen/shortTermRequests/ShortTermRequestsApplicantsManagement.tsx |
| 단기 의뢰 상세 등록화면.html | ShortTermRequestsInput.tsx | screen/shortTermRequests/ShortTermRequestsInput.tsx |

### 전문가 프로필
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 전문가 프로필 목록.html | ExpertsList.tsx | screen/experts/ExpertsList.tsx |
| 전문가 프로필 상세.html | ExpertsDetail.tsx | screen/experts/ExpertsDetail.tsx |
| 전문가 프로필 등록.html | ExpertsRegistration.tsx | screen/experts/ExpertsRegistration.tsx |

### 교육
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 교육 등록 목록.html | EducationList.tsx | screen/education/EducationList.tsx |
| 교육 상세.html | EducationDetail.tsx | screen/education/EducationDetail.tsx |
| 교육 등록.html | EducationRegistration.tsx | screen/education/EducationRegistration.tsx |
| 교육 수강생 목록.html | EducationStudents.tsx | screen/education/EducationStudents.tsx |

### 채용
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 01채용 공고 지원.html | RecruitmentList.tsx | screen/recruitment/RecruitmentList.tsx |
| 01채용 공고 지원뷰어.html | RecruitmentDetail.tsx | screen/recruitment/RecruitmentDetail.tsx |
| 채용 지원자 관리.html | RecruitmentApplicants.tsx | screen/recruitment/RecruitmentApplicants.tsx |
| 채용 등록.html | RecruitmentInput.tsx | screen/recruitment/RecruitmentInput.tsx |
| 채용 등록 목록.html | RecruitmentRegistration.tsx | screen/recruitment/RecruitmentRegistration.tsx |
| 채용 상세.html | RecruitmentDetail.tsx | screen/recruitment/RecruitmentDetail.tsx |

### 마이페이지
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 마이페이지_개인.html | MyPagePersonal.tsx | screen/myPage/MyPagePersonal.tsx |
| 마이페이지_기업.html | MyPageCorporate.tsx | screen/myPage/MyPageCorporate.tsx |

### 기업 정보
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 02기업정보 등록.html | RegistrationCompany.tsx | screen/auth/RegistrationCompany.tsx |
| 02기업정보 뷰어.html | CompanyRegistrationEdit.tsx | screen/myPage/CompanyRegistrationEdit.tsx |

### 결제 관리
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 결제내역리스트_개인.html | PaymentManagementPersonal.tsx | screen/payment/PaymentManagementPersonal.tsx |
| 결제내역리스트_기업.html | PaymentManagementCorporate.tsx | screen/payment/PaymentManagementCorporate.tsx |
| 결제수단관리.html | PaymentMethods.tsx | screen/payment/PaymentMethods.tsx |
| 장바구니_개인.html | ShoppingCartPersonal.tsx | screen/payment/ShoppingCartPersonal.tsx |
| 장바구니_기업.html | ShoppingCartCorporate.tsx | screen/payment/ShoppingCartCorporate.tsx |

### 포트폴리오
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 포트폴리오_등록.html | PortfolioRegistration.tsx | screen/portfolio/PortfolioRegistration.tsx |
| 포트폴리오_리스트.html | PortfolioList.tsx | screen/portfolio/PortfolioList.tsx |
| 포트폴리오_상세.html | PortfolioDetail.tsx | screen/portfolio/PortfolioDetail.tsx |

### 관리자 페이지
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| admin-dashboard.html | AdminDashboard.tsx | screen/admin/AdminDashboard.tsx |
| admin-sidebar.html | AdminSidebar.tsx | components/common/AdminSidebar.tsx |
| news-manage.html | NewsManage.tsx | screen/admin/NewsManage.tsx |
| news-create.html | NewsCreate.tsx | screen/admin/NewsCreate.tsx |
| inquiry-list.html | InquiryManage.tsx | screen/admin/InquiryManage.tsx |
| 사용자_리스트_관리자.html | UserListManagement.tsx | screen/admin/UserListManagement.tsx |
| payment-manage.html | PaymentManage.tsx | screen/admin/PaymentManage.tsx |
| skill-manage.html | SkillManage.tsx | screen/admin/SkillManage.tsx |
| matching-dashboard.html | MatchingDashboard.tsx | screen/admin/MatchingDashboard.tsx |
| expert-matching.html | ExpertMatching.tsx | screen/admin/ExpertMatching.tsx |
| project-matching.html | ProjectMatching.tsx | screen/admin/ProjectMatching.tsx |
| expert-recommendation.html | ExpertRecommendation.tsx | screen/admin/ExpertRecommendation.tsx |
| expert-verification.html | ExpertVerification.tsx | screen/admin/ExpertVerification.tsx |
| admin-settings.html | AdminSettings.tsx | screen/admin/AdminSettings.tsx |
| admin-reports.html | AdminReports.tsx | screen/admin/AdminReports.tsx |
| admin-account-management.html | AdminAccountManagement.tsx | screen/admin/AdminAccountManagement.tsx |
| admin_history_log.html | AdminHistoryLog.tsx | screen/admin/AdminHistoryLog.tsx |
| admin_system_state.html | AdminSystemState.tsx | screen/admin/AdminSystemState.tsx |

### 기타 페이지
| HTML 파일 | TypeScript 컴포넌트 | 경로 |
|-----------|-------------------|------|
| 1대1_문의등록.html | InquiryRegistration.tsx | screen/inquiry/InquiryRegistration.tsx |
| 1대1_문의상세.html | InquiryDetail.tsx | screen/inquiry/InquiryDetail.tsx |
| QA질문.html | FAQ.tsx | screen/help/FAQ.tsx |
| 성공사례.html | SuccessCases.tsx | screen/help/SuccessCases.tsx |
| 설정.html | Settings.tsx | screen/settings/Settings.tsx |
| 서비스이용내역_개인.html | ServiceHistoryPersonal.tsx | screen/myPage/ServiceHistoryPersonal.tsx |
| 서비스이용내역_기업.html | ServiceHistoryCorporate.tsx | screen/myPage/ServiceHistoryCorporate.tsx |
| 북마크_개인.html | BookmarkPersonal.tsx | screen/myPage/BookmarkPersonal.tsx |
| 북마크_기업.html | BookmarkCorporate.tsx | screen/myPage/BookmarkCorporate.tsx |
| 리뷰관리.html | ReviewManagement.tsx | screen/myPage/ReviewManagement.tsx |
| 일정관리_개인.html | ScheduleManagerPersonal.tsx | screen/myPage/ScheduleManagerPersonal.tsx |
| 일정관리_기업.html | ScheduleManagerCorporate.tsx | screen/myPage/ScheduleManagerCorporate.tsx |
| 기업연혁관리.html | CompanyHistoryManagement.tsx | screen/myPage/CompanyHistoryManagement.tsx |

## 변환 시 고려사항

### 1. TypeScript 타입 정의
- 각 페이지의 props 타입 정의
- API 응답 타입 정의
- 폼 데이터 타입 정의

### 2. 컴포넌트 구조
- Functional Component + React Hooks 사용
- 상태 관리: useState, useContext
- API 통신: useEffect, axios/fetch

### 3. 스타일링
- CSS Modules 또는 Styled-components 사용
- 반응형 디자인 유지
- 공통 스타일 변수 정의

### 4. 라우팅
- React Router 설정
- 동적 라우팅 파라미터 처리
- 페이지 이동 로직 구현

### 5. 폼 처리
- Form validation 로직 추가
- 입력 값 상태 관리
- 제출 처리 API 연동

## 구현 우선순위

### 1순위: 기본 화면 (Core Features)
1. Home.tsx - 메인 대시보드
2. Login.tsx, Signup.tsx - 인증
3. ShortTermRequestsList.tsx - 단기 의뢰 목록
4. ExpertsList.tsx - 전문가 목록

### 2순위: 사용자 관리
1. MyPagePersonal.tsx, MyPageCorporate.tsx - 마이페이지
2. RegistrationPersonal.tsx, RegistrationCompany.tsx - 회원가입
3. ServiceHistoryPersonal.tsx, ServiceHistoryCorporate.tsx - 이용내역

### 3순위: 기능 확장
1. Education 관련 페이지
2. Recruitment 관련 페이지
3. Portfolio 관련 페이지

### 4순위: 관리자 기능
1. AdminDashboard.tsx
2. 관리자 설정 및 관리 페이지들

## 다음 단계
1. `_frontServer/src` 폴더 구조 생성
2. 기본 TypeScript 설정 및 라우팅 구축
3. 공통 컴포넌트 및 타입 정의
4. 순차적 페이지 변환 작업 진행