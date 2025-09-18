Food Ordering App
=================

This repository contains a simple Food Ordering web application (frontend + backend)
implemented for the B215 Software Testing assignment. It is intentionally minimal
but complete: endpoints and frontend behaviors are implemented to satisfy the
10 provided user stories. Automated tests are included for both backend and frontend.

Structure:
- backend/  -> Node.js + Express backend with Jest + Supertest tests
- frontend/ -> React (Vite) frontend with Vitest + Testing Library tests

Instructions:
1. Install Node.js (v18+) and npm.
2. For backend:
   cd backend
   npm install
   npm test   # runs backend tests
   npm start  # starts backend on port 3001
3. For frontend:
   cd frontend
   npm install
   npm test   # runs frontend tests
   npm run dev   # starts dev server (Vite) on 5173
4. The frontend expects the backend at http://localhost:3001

Notes:
- This project uses in-memory storage for orders (no DB).
- Do not update the GitHub repo after the deadline (assignment rule).
