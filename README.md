# React Admin Template
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## 설치
```bash
yarn install
```

## Dev 서버 실행

```bash
yarn dev
```
[http://localhost:3000](http://localhost:3000)


## 빌드 & Prod 서버 실행
```bash
yarn build
yarn start
```
[http://localhost:3000](http://localhost:3000) 

## 폴더 구조
`api`: axios 요청 wrapper, 컴포넌트에서 `react-query` 를 통해 호출  
`components`: 공통 컴포넌트  
`contexts`: 전역 상태를 위한 컨태스트  
`config`: 프로젝트 설정, `menus.ts` 로 GNB, LNB 구성  
`hooks`: 커스텀 훅  
`layout`: 페이지 레이아웃 컴포넌트  
`pages-component`: 페이지 컴포넌트를 구성하는 컴포넌트, pages 하위 경로와 동일하게 관리  
`pages`: 페이지 컴포넌트, 하위 디렉토리 구조대로 라우팅 생성

## 기술스택
- React  
- Next.js  
- react-query  
- Antd, less : [next-plugin-antd-less](https://github.com/SolidZORO/next-plugin-antd-less)
- emotion
- ag-grid react
- eslint, prettier  





