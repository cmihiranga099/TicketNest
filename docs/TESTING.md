# Testing Strategy

## Unit tests
- Services: booking totals, seat lock checks, password hashing, token validation.
- Validation: Zod schemas for request payloads.

## Integration tests
- Booking flow: initiate -> create payment -> webhook -> confirm.
- Seat lock expiry behavior.

## End-to-end tests
- Browser booking journey using Playwright or Cypress.
- Admin report access control.

## User acceptance tests
- Multi-user seat contention.
- Payment failure and retry handling.
- Notification delivery (email/SMS).
