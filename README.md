# FarmTrip

농장 체험 예약과 농산물 직거래를 한 곳에서 제공하는 통합 플랫폼입니다.

## 프로젝트 소개

FarmTrip은 도시 거주자들이 신뢰할 수 있는 농산물을 직거래로 구매하고, 자녀 교육 및 힐링을 위한 다양한 농장 체험 정보를 한 곳에서 찾고 예약할 수 있도록 돕는 플랫폼입니다.

### 주요 기능

1. **자유게시판**

   - 게시판 메인 페이지
   - 게시판 등록 & 수정 페이지
   - 게시판 상세 페이지

2. **로그인/로그아웃**

3. **농장 체험**

   - 농장 체험 메인 페이지
   - 농장 등록 & 수정 페이지
   - 농장 상세 페이지

4. **마이페이지**

   - 거래내역 & 북마크
   - 포인트 사용 내역
   - 비밀번호 변경

5. **농산품**
   - 농산품 메인 페이지
   - 농산품 등록 & 수정 페이지
   - 농산품 상세 페이지

## 기술 스택

- **프론트엔드**: Next.js 16, React 19
- **백엔드**: GraphQL, Apollo Client
- **상태관리**: Zustand
- **스타일링**: Tailwind CSS, Material-UI (MUI)
- **테스트**: Jest

## 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- Yarn (패키지 매니저)

### 설치

```bash
yarn install
```

### 개발 서버 실행

```bash
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
yarn build
```

### 프로덕션 실행

```bash
yarn start
```

## Git Flow

### ⚙️ 핵심 브랜치

- **main**: 배포용. 직접 커밋 금지. 작업 브랜치 또는 `hotfix/*`만 병합.

---

### 🚀 작업 브랜치 (main에서 분기 → main으로 PR)

- **feat/**: 새 기능 개발
- **refactor/**: 기능 변화 없는 리팩토링
- **style/**: 스타일/UI 수정 (로직 수정 없음)
- **docs/**: 문서 작업
- **chore/**: 설정/환경 작업
- **fix/**: 일반 버그 수정

---

### 🩹 긴급 수정 브랜치

- **hotfix/**: 배포 후 치명적 버그 수정 (main에서 분기 → main으로 직접 병합)

## CI/CD

GitHub Actions를 사용하여 자동화된 CI/CD 파이프라인을 구축했습니다.

### CI (Continuous Integration)

`main` 브랜치로 PR을 생성하거나 `main`에 직접 push하면 자동으로 실행됩니다:

1. **Lint & Type Check**: ESLint와 TypeScript 타입 체크
2. **Build**: 프로덕션 빌드 테스트
3. **Test**: Jest 테스트 실행 (테스트가 없어도 실패하지 않음)

워크플로우 파일: `.github/workflows/ci.yml`

### 사용 가능한 스크립트

```bash
# 린트 실행
yarn lint

# 린트 자동 수정
yarn lint:fix

# TypeScript 타입 체크
yarn type-check

# 테스트 실행
yarn test

# 테스트 감시 모드
yarn test:watch

# 테스트 커버리지
yarn test:coverage
```
