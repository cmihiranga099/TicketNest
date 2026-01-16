# Runbook

## Local setup
1. Create Postgres database and run `backend/src/db/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and set Stripe keys and webhook secret.
3. Copy `frontend/.env.example` to `frontend/.env` and set the API base URL if needed.
4. Install dependencies in `backend/` and `frontend/`.
5. Start API: `npm run dev` in `backend/`.
6. Start web: `npm run dev` in `frontend/`.

## Operations
- Rotate JWT and Stripe webhook secrets every 90 days.
- Monitor seat lock cleanup and payment webhook errors.
- Archive old bookings to keep reports fast.

## Incident response
- If Stripe webhooks fail, reconcile by querying `payments` with `status = 'PENDING'`.
- For seat contention spikes, scale Redis and add rate limiting.
