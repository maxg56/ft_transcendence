# 🌐 ft_transcendence

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Badge">
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify Badge">
  <img src="https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white" alt="MariaDB Badge">
  <img src="https://img.shields.io/badge/Caddy-00C7B7?style=for-the-badge&logo=caddy&logoColor=white" alt="Caddy Badge">
  <img src="https://img.shields.io/badge/2FA-Enabled-green?style=for-the-badge" alt="2FA Badge">
  <img src="https://img.shields.io/badge/WebSockets-Supported-blue?style=for-the-badge" alt="WebSockets Badge">
  <img src="https://img.shields.io/badge/Multilingual-FR%20%7C%20EN%20%7C%20PT%20%7C%20Klingon-blueviolet?style=for-the-badge" alt="Multilingual Badge">

</div>

## 🚀 Project Overview

**ft_transcendence** is a fullstack project developed at 42, aiming to deliver an interactive online gaming platform based on **Pong**.  
Users can log in, manage their profiles, play with friends or an AI, and track their game stats.

This project uses a **modern stack** combining **React/Vite/Shetson UI** on the frontend, **Fastify microservices** on the backend, a **Caddy** reverse proxy, and **MariaDB** for persistence.

## ✨ Key Features

- 🎮 **Pong Game**:
  - Play against AI or friends
  - Tournament mode
  - Skill-based matchmaking
- 🔐 **Security**:
  - Two-Factor Authentication (2FA)
  - Full user account management
- 📊 **Stats**:
  - Match history
  - Player and tournament statistics
- 🗣️ **Social Tools**:
  - Invite friends
  - Private game rooms

## 🔧 Installation & Setup

### 1. Clone the Project

```bash
git clone https://github.com/your_github/ft_transcendence.git
cd ft_transcendence
````

### 2. Start the Project

```bash
make dev      # Development mode
make prod     # Production mode
```

> Required dependencies:
>
> * Node.js
> * MariaDB
> * Caddy properly configured

## 🧱 Architecture Overview

```
.
├── api/         # Fastify microservices
│   ├── auth-service/
│   ├── game-service/
│   ├── stats-service/
│   └── user-service/
├── frontend/ # React + Vite + Shetson UI
├── services/
│   ├── DB/
│   ├── ELK/
│   ├── monitoring/
│   └── proxy/
└── .github/
    └── workflows/
        ├── Check.yml
        └── ci-cd.yml
```
## 🌍 Internationalization

The platform supports multiple languages, including:

- **French**
- **English**
- **Portuguese**
- **Klingon** (yes, the Star Trek one)

Users can switch languages directly from their account settings for a personalized experience.

## 🖼️ Project Screenshots

### 1. Login & 2FA Authentication

![Login](images/login.gif)


### 2. Hub

![Matchmaking](images/hub.gif)

### 3. Pong Gameplay

* Real-time view
* Tournament and solo modes

![Pong](images/pong.gif)

### 4. User Statistics

![Stats](images/stats.gif)

## 👤 Author

  - [@ThomasL6](https://github.com/ThomasL6)
  - [@Asa973 ](https://github.com/Asa973 )
  - [@ManonPe ](https://github.com/ManonPe )
  - [@maxg56](https://github.com/maxg56)



## 🙏 Acknowledgments

Thanks to the 42 school staff for the opportunity to build this project, and to the open-source community for the amazing tools used.

---

> This project demonstrates modern fullstack skills including WebSockets, real-time multiplayer game logic, secure user management, and microservice architecture.
