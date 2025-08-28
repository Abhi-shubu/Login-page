# 🔐 Brute-Force-Protected Login Application
Design and implement a full-stack login application with brute-force lockout mechanisms

- Frontend: React + Vite + TailwindCSS
- Backend:Node js+ Express.js 
- Database:MongoDB
- Hosting: Render

✨ Features
#Backend:-
-Secure signup and login with email & password.
-Passwords are hashed with bcrypt before storage.
-JWT-based authentication with HttpOnly cookies for added security.
-Brute-force Protection
-User Lockout: Accounts are locked for 15 minutes after 5 failed login attempts.

-IP Lockout: IP addresses are blocked for 5 minutes if they exceed 100 failed login attempts in 5 minutes.

# Frontend:-
-Modern login UI with password visibility toggle.
-"Remember Me" option using localStorage to persist credentials securely.

#Database:-
-User Model → stores user credentials, failed attempts, and lockout info.
-IP Model → tracks IP addresses, failed attempts, and temporary blocks.

#Testing (Jest):-
-Unit tests for user & IP lockout logic.
-Verifies that users are locked after 5 failed attempts.
-Ensures IPs are blocked after repeated failures.

#Deployment:-
-Works on Render (or any Node hosting platform).
-onfigurable via environment variables (.env).
-Optimized package.json scripts for build & deployment.

## ⚙️ Installation & Setup
-git clone https://github.com/Abhi-shubu/Login-page
-cd Login-page
## Install client + server dependencies :- npm install
#Setup environment variables client + server:- Copy-Item .env.example .env

#Run in development:- npm run dev
#Test:- npm test







