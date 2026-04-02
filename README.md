# 감정 일기장 (Diary)

매일 기분(이모티콘)과 몇 줄의 글을 남기고, 사진/음성 메모를 첨부할 수 있는 일기장 앱입니다. 지난 기록은 히스토리(스크롤/달력)로 쉽게 찾아볼 수 있고, 트렌드 페이지에서 감정 변화와 단어/비율 시각화를 확인할 수 있어요.

## 배포 바로가기

- https://<your-project>.vercel.app

## 주요 기능

- 일기 작성/수정/삭제: 기분(이모티콘) 선택 + 강도(1~5) + 텍스트 + 사진/음성 첨부
- 홈: “새 일기”로 빠른 추가 + 최근 일기 목록
- 히스토리: 스크롤 목록 + 달력 날짜 클릭으로 조회
- 트렌드: 기간(7/30/90일) 기준 기분 변화, 단어 빈도 카드, 감정 비율 파이 차트

## 기술 스택

- React + TypeScript + Vite
- React Router
- IndexedDB(idb) 로컬 저장
- Recharts 차트
- Tailwind CSS

## 실행 방법

```bash
npm install
npm run dev
```

## 품질 체크

```bash
npm run check
npm run lint
npm run build
```
