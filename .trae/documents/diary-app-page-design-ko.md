# 페이지 설계서 (Desktop-first)

## Global Styles
- Layout system: 기본은 CSS Grid(페이지 골격) + Flexbox(행/카드 내부 정렬) 하이브리드.
- Breakpoints: Desktop 1200px 기준, Tablet 768~1199px(2열→1열 축소), Mobile ≤767px(단일 컬럼, 하단 고정 CTA 최소화).
- Design tokens
  - Background: `#0B1220` (다크), Surface: `#111A2E`, Card: `#16213A`
  - Text: Primary `#E5E7EB`, Secondary `#9CA3AF`
  - Accent(감정 컬러): 기쁨 `#F59E0B`, 슬픔 `#60A5FA`, 분노 `#EF4444`, 불안 `#A78BFA`, 평온 `#34D399`
  - Border: `#22304F`, Radius: 12px, Shadow: subtle(0 8px 24px rgba(0,0,0,.25))
  - Typography: 16px base, H1 28/36, H2 20/28, Body 16/24, Caption 13/18
  - Buttons: Primary(Accent 기반), Secondary(Outline), Danger(삭제)
  - Hover/Focus: hover 시 밝기 +6%, focus ring `2px solid rgba(245,158,11,.6)`
- Common components
  - Top App Bar(로고/페이지 타이틀/우측 액션), Card, Modal, Toast, DateRangePicker, EmotionChip, ChartCard

---

## 1) 로그인/가입 (/auth)
### Meta Information
- Title: 로그인 | 감정 일기
- Description: 개인 일기 보관을 위한 로그인/가입.
- Open Graph: `og:title`, `og:description`, `og:type=website`

### Page Structure
- Centered single-column(최대 420px) + 배경 그라데이션(은은).

### Sections & Components
1. 헤더 영역
   - 로고 + 한 줄 카피(“오늘의 감정을 기록해요”)
2. 로그인 폼 카드
   - 이메일 입력
   - 인증 방식 안내 텍스트(매직링크/비밀번호 중 택1 구현)
   - Primary 버튼(“로그인/링크 보내기”)
3. 하단 안내
   - 개인정보/보안 안내 문구(짧게)

Interaction
- 제출 성공: 토스트 + 홈으로 라우팅
- 실패: 인라인 에러(이메일 형식/인증 실패)

---

## 2) 홈(일기 목록) (/)
### Meta Information
- Title: 홈 | 감정 일기
- Description: 최근 일기 목록과 필터, 트렌드 접근.
- Open Graph: `og:title`, `og:description`

### Layout
- Desktop: 12-column grid
  - 좌측(3~4col): 필터 패널
  - 우측(8~9col): 목록/콘텐츠
- Tablet/Mobile: 필터는 상단 접힘(Accordion)으로 전환

### Page Structure
- Top App Bar + (필터 패널) + 목록 영역

### Sections & Components
1. Top App Bar
   - 좌: 앱명
   - 우: “트렌드”, “새 일기” 버튼
2. 필터 패널
   - 날짜 범위 선택(기본: 최근 30일)
   - 감정 칩 멀티 선택(대표 감정 필터)
   - 초기화 버튼
3. 일기 목록
   - DiaryCard: 날짜(크게), 감정 칩, 강도(막대/점 5개), 본문 1~2줄 프리뷰, 첨부 아이콘(사진/음성 유무)
   - 로딩 스켈레톤, 빈 상태(“첫 일기를 작성해보세요” + CTA)

Interaction
- 카드 클릭: 상세로 이동
- 새 일기: 작성 페이지로 이동

---

## 3) 일기 작성/수정 (/entries/new, /entries/:id/edit)
### Meta Information
- Title: 일기 작성 | 감정 일기 (수정 시: 일기 수정)
- Description: 감정 선택, 텍스트 작성, 사진/음성 첨부.

### Layout
- Desktop: 2열
  - 좌측: 감정/메타/첨부
  - 우측: 본문 에디터
- Mobile: 감정→본문→첨부 순서로 스택

### Page Structure
- Top App Bar(뒤로가기, 저장) + 편집 폼

### Sections & Components
1. 상단 액션
   - 뒤로가기
   - Primary: 저장
   - (수정 모드) Secondary: 취소
2. 감정 선택 카드
   - EmotionChip single-select
   - 강도 슬라이더(1~5) + 현재 값 라벨
3. 본문 에디터
   - 제목 입력(선택)
   - 본문 textarea(자동 높이 확장)
4. 첨부 섹션
   - 사진 업로드: 드래그앤드롭/파일 선택, 썸네일 그리드, 개별 삭제
   - 음성 녹음: 녹음 시작/정지, 재생 프리뷰, 삭제
5. 검증/에러
   - 저장 시 필수값(대표 감정, 본문) 검증 및 메시지

Interaction
- 저장 성공: 상세로 이동(또는 홈으로 복귀)
- 업로드 진행: 첨부 카드에 진행률 표시

---

## 4) 일기 상세 (/entries/:id)
### Meta Information
- Title: 일기 상세 | 감정 일기
- Description: 기록과 첨부를 확인하고 수정/삭제.

### Layout
- Desktop: 최대 860px 중앙 정렬 + 사이드 액션(우측 상단)

### Page Structure
- 헤더(날짜/감정) + 본문 + 첨부

### Sections & Components
1. 헤더
   - 날짜(큰 타이포)
   - 대표 감정 칩 + 강도 표시
   - 우측: 수정, 삭제(Danger)
2. 본문
   - 제목(있으면)
   - 본문 텍스트(줄바꿈 유지)
3. 첨부
   - 사진: 라이트박스 가능한 갤러리
   - 음성: 오디오 플레이어(재생/일시정지, 진행 바)
4. 삭제 확인 모달
   - “정말 삭제할까요?” + 확인/취소

---

## 5) 트렌드(인사이트) (/insights)
### Meta Information
- Title: 트렌드 | 감정 일기
- Description: 감정 변화, 단어 카드, 감정 분포.

### Layout
- Desktop: 카드형 대시보드(Grid)
  - 상단: 기간 선택(7/30/90일, 커스텀)
  - 본문: 2열 카드(감정 변화/파이차트), 하단 전체폭(단어 카드)
- Mobile: 카드 1열 스택

### Page Structure
- Top App Bar(뒤로가기) + 기간 필터 + 차트 카드들

### Sections & Components
1. 기간 선택 바
   - Segmented control(7/30/90) + DateRangePicker(옵션)
2. 감정 변화 카드(시계열)
   - Line/Area chart: x=날짜, y=강도(1~5)
   - 툴팁: 날짜, 감정 라벨, 강도
   - 빈 데이터: “선택 기간에 기록이 없어요”
3. 감정 분포 파이차트 카드
   - Pie chart: 감정별 비율
   - 범례: 감정 라벨 + 개수 + %
4. 단어 카드 섹션
   - KeywordCard grid(최대 12개)
   - 카드 내용: 키워드, 빈도, 관련 일기 개수(가능하면)
   - 정렬: 빈도 내림차순, 동일 시 최근 등장 우선

Interaction
- 기간 변경 시: 모든 카드 동시 재조회/재계산(로딩 상태는 카드 단위 스켈레톤)
- 카드 클릭(선택): 해당 키워드/감정으로 홈 필터 적용 후 목록으로 이동(선택 구현)