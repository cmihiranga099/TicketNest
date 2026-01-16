# TicketNest API

Base URL: `http://localhost:4000`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/forgot`
- `POST /auth/reset`
- `GET /auth/me`
- `PATCH /auth/me`

## Movies
- `GET /movies`
- `GET /movies/:id`
- `POST /movies` (admin)
- `PUT /movies/:id` (admin)
- `DELETE /movies/:id` (admin)

## Halls/Seats
- `GET /halls`
- `GET /halls/:id`
- `GET /halls/:id/seats`
- `POST /halls` (admin)
- `POST /halls/:id/seats` (admin)

## Showtimes
- `GET /showtimes?movieId=`
- `GET /showtimes/:id`
- `POST /showtimes` (admin)

## Bookings
- `GET /bookings/me`
- `GET /bookings/showtimes/:id/seats`
- `POST /bookings/initiate`
- `GET /bookings/:id`
- `POST /bookings/:id/confirm`

## Payments
- `POST /payments/create`
- `POST /payments/webhook`

## Admin
- `GET /admin/reports/sales`
