# 🐇 Bindly Frontend
<h4 align="center"> 
<img src="https://github.com/user-attachments/assets/caddfeb7-1a14-4c00-a03e-cf72b9eb74d3" alt="long" border="0">
 </h4>
 
✨ **Bindly** 프로젝트의 프론트엔드 저장소입니다!  

**사용자의 대화 데이터를 분석하고 시각화하는 기능**을 제공하는 웹 서비스입니다. 💬📊

---

## 🚀 주요 기능

### ❤ **메인 화면**
>  **로그인 및 회원 가입, 그리고 챗봇과의 대화 내역을 확인할 수 있어요.** 🔑
>   - **아이디**: 특수 문자를 포함한 6자 이상 20자 이하
>   - **비밀번호**: 최대 20자 설정 가능
> <h4 align="left"> 
> <img src="https://github.com/user-attachments/assets/d3cabc28-e248-4b15-9dce-be510eecb6e4" alt="long" border="0" width = 800>
> </h4>
 

### 🧡 **업로드 화면**
> **사용자가 카톡에서 내보낸 대화 TXT 파일을 업로드합니다.** 📤 
> <h4 align="left"> 
>  <img src="https://github.com/user-attachments/assets/2724aab8-f070-4b16-8179-84e1650fdf25" alt="long" border="0" width = 800>
>  </h4>

### 💛 **결과 분석 화면**
> **업로드된 대화 데이터의 분석 결과를 한눈에** 📊
> - Bindly 모델이 대화 상대와의 관계, 친밀감 점수, 그리고 공감형 대화의 비중을 분석해 줍니다.
> - 도넛 차트 🥯 및 워드 클라우드 ☁ 제공
> - 차트 클릭 시 팝업으로 상세 정보 표시
     
<h4 align="left"> 
<img src="https://github.com/user-attachments/assets/d157cd15-962d-4345-af3e-f18008d0a7a9" alt="long" border="0" width = 800>
 </h4>
 
### 💚 **피드백 톡 구현** 
> **AI와 실시간으로 자신의 대화법에 대한 피드백을 주고받을 수 있어요! 📝**
> - 피드백을 듣고 싶은 사용자(나, 상대 중) 선택
> - AI의 피드백 스타일을 선택 (공감 vs 팩트폭력)
> - AI가 대화를 분석하고, 더 나은 소통 방식을 제안
<h4 align="left"> 
<img src="https://github.com/user-attachments/assets/3d780b21-510f-431b-8a91-f976f5917bf4" alt="long" border="0" width = 800>
</h4>





---

## 🛠️ 설치 및 실행 방법

1️⃣ **저장소 클론** 🖥️
```bash
git clone https://github.com/NeedTalkKey/bindly_front.git
```

2️⃣ **의존성 설치** 📦
```bash
cd bindly_front
npm install
```

3️⃣ **개발 서버 실행** 🚀
```bash
npm start
```

🔗 이제 브라우저에서 `http://localhost:3000` 으로 접속하세요! 🌍

---

## 📁 프로젝트 구조

```
bindly_front/
├── public/          # 정적 파일
├── src/
│   ├── components/  # 재사용 가능한 UI 컴포넌트
│   ├── pages/       # 각 페이지별 컴포넌트
│   ├── services/    # API 호출 및 비즈니스 로직
│   └── App.js       # 루트 컴포넌트
├── .gitignore       # Git에서 제외할 파일 목록
├── package.json     # 프로젝트 메타데이터 및 의존성
└── README.md        # 프로젝트 정보 파일
```

---

## 🌱 기여 방법

🎯 이 프로젝트에 기여하고 싶다면?
1. 저장소를 **포크(Fork)** 해주세요! 🍴
2. 새로운 기능을 추가하거나 버그를 수정한 후 **풀 리퀘스트(PR)** 를 보내주세요! 🚀
3. 코드 스타일을 맞춰주세요! (Prettier, ESLint 적용 예정) 🎨

📌 문의 사항이 있으면 [이슈](https://github.com/NeedTalkKey/bindly_front/issues)에 등록해주세요! 📝

---

## 📜 라이선스

📝 이 프로젝트는 **MIT 라이선스** 하에 배포됩니다. 자유롭게 사용하세요! ✨

---

## 📆 업데이트 내역

📌 **2025.02.14** - 메인 화면 및 업로드 화면 구현 🎉

📌 **2025.02.17** - 결과 분석 화면 구현, 로그인 및 회원가입 기능 추가 ✅

📌 **2025.02.18** - 도넛 차트 및 워드 클라우드 클릭 시 팝업 기능 추가 📊

📌 **2025.02.19** - 회원가입 시 입력 검증 추가 및 UI 개선 💡

📌 더 자세한 변경 사항은 커밋 기록을 확인해주세요! 🧐

---
🐾 **팀 톡끼 | Team Talky** : 김남희, 김채연, 박건우, 박치호, 안승균 <br>

**Bindly** 프로젝트의 다른 Git도 둘러보세요!
> 🐰 [Bindly Back-end](https://github.com/NeedTalkKey/bindly_back)
> 
> ⚡ [Bindly Fast-API](https://github.com/NeedTalkKey/bindly_fastapi)
