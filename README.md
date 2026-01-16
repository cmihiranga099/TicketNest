# TicketNest

Cinema hall ticket booking system with user authentication, showtime management, seat selection, and payment confirmation. Includes a React frontend and Express/TypeScript backend.

## Structure
- `backend/` Express API + Postgres schema
- `frontend/` React SPA
- `docs/` Architecture, API, and testing documentation

## Quick start
1. Initialize Postgres and run `backend/src/db/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and update secrets.
3. Install dependencies in `backend/` and `frontend/`.
4. Copy `frontend/.env.example` to `frontend/.env` and set API URL if needed.
5. Start API: `npm run dev` in `backend/`.
6. Start web: `npm run dev` in `frontend/`.
