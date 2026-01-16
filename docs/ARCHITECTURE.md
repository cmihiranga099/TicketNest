# TicketNest Architecture

## Overview
TicketNest is a cinema hall ticket booking platform with a modular React frontend and an Express/TypeScript backend. It supports user authentication, movie/showtime management, seat locking, and payment confirmation workflows.

## Components
- `frontend/`: React SPA with booking flow, seat map UI, and admin dashboard shell.
- `backend/`: Express API with PostgreSQL persistence and JWT auth.
- `backend/src/db/schema.sql`: relational schema for core entities.

## Key flows
1. User selects movie and showtime.
2. Seats are locked for a short TTL during checkout.
3. Payment confirmation finalizes the booking and issues a booking code + QR payload.
4. Confirmation is sent through notification providers (email/SMS integration pending).

## Security & scalability
- JWT access and refresh tokens.
- Parameterized SQL with `pg` for injection safety.
- Seat locking is modeled in `seat_locks` for Redis migration.
- Stripe Checkout + webhook signature verification.

## Deployment notes
- API and web can be deployed separately. Use a managed Postgres instance and Redis for seat locks.
- Add object storage for posters and QR assets.
