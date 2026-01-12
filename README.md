# Chatting Website

## 프로젝트 소개

이 프로젝트는 **대학교 동아리 활동 분위기에서 개인적으로 진행한 웹 프로젝트**로,  
**Vibe Coding** 방식을 활용하여 **간단한 채팅 웹사이트**를 구현했습니다.

AI와 자연어 기반으로 상호작용하며 기능을 설계·구현하는 과정을 통해,  
웹 개발의 전반적인 구조와 **실시간 통신 개념**을 학습하는 것을 목표로 했습니다.

---

## 개발 목적

- 웹 기반 채팅 서비스의 기본 구조 이해
- 프론트엔드–백엔드–소켓(Socket) 통신 흐름 학습
- Vibe Coding을 활용한 빠른 프로토타이핑 경험

---

## 프로젝트 구조

```text
chattingWebsite
├── backend
│   ├── src
│   │   ├── index.js        # 서버 시작 파일
│   │   ├── socket.js       # Socket.IO 실시간 통신
│   │   ├── db.js           # DB 연결 설정
│   │   └── routes
│   │       ├── users.js    # 사용자 관련 API
│   │       └── dm.js       # 채팅(DM) 관련 API
│   └── sql
│       └── init.sql        # 데이터베이스 초기화 스크립트
├── frontend
│   ├── login               # 로그인 관련 화면
│   ├── main                # 채팅 메인 화면
│   └── index.html
└── README.md
