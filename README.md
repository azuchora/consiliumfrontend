# 🩺 CONSILIUM – Discussion Forum for Doctors (Frontend)

[![🇵🇱](https://flagcdn.com/w20/pl.png) Czytaj po polsku](README.pl.md)

## 📌 Description

The **CONSILIUM** project was developed as part of my bachelor’s thesis in Computer Science. The goal was to create a real web application that supports medical professionals in the consultation process, while also developing skills in **React**, **REST API**, UX, and frontend-backend system design.

## Purpose of the application

The application serves as a **closed discussion forum** for doctors, supporting the diagnostic process by enabling the exchange of knowledge, experiences, and joint analysis of clinical cases.

## ⚙️ Technologies

- **React.js** – main framework for building the user interface
- **React Router** – handling multiple views in a SPA
- **Axios** – ommunication with the backend REST API 
- **Context API** – global application state (authorization, user)

## ✨ Main features (frontend)

- Login / registration / verification of doctors
- Browsing and filtering discussion threads
- Creating new topics and adding comments (and replies to comments)
- Responsive interface adapted to various devices
- Private discussions between doctors
- Session management and token-based authorization

## 🚀 How to run the frontend locally

> ⚠️ **Important**
> The application requires a running backend (API). Backend repository: [consiliumbackend](https://github.com/Rzanklod/consiliumbackend)
> 🐳 Docker support coming soon™

1. Clone the repository:

```bash
git clone https://github.com/Rzanklod/consiliumfrontend.git
cd consiliumfrontend
```

2. Install project dependencies:

```bash
npm install
```

3. Run the application in development mode:

```bash
npm start
```

4. Open your browser and go to:

```bash
http://localhost:3000
```