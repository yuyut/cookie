# Cookie API

NestJS backend with JWT auth, role-based access control, and a local SQLite database.

## Stack

- NestJS
- SQLite via better-sqlite3
- TypeORM
- Passport + JWT
- class-validator

## Running it

```bash
cd backend
npm install
npm run start:dev
```

Runs on `http://localhost:3001`. Swagger UI is at `http://localhost:3001/api`.

On first run, an admin account gets created:

| Email | Password | Role |
|---|---|---|
| admin@admin.com | admin123 | admin |

Anyone who registers through the API gets the `user` role by default.

## Endpoints

### Auth

| Method | Path | Notes |
|---|---|---|
| POST | /auth/register | `{ email, password }` |
| POST | /auth/login | returns `access_token` |

### Cookies — any logged in user

| Method | Path |
|---|---|
| GET | /cookies |
| GET | /cookies/:id |
| POST | /cookies |
| PATCH | /cookies/:id |
| DELETE | /cookies/:id |

POST/PATCH body: `{ name, flavor, quantity, cookieJarId }`

### Cookie Jar — admin only

| Method | Path |
|---|---|
| GET | /cookie-jar |
| GET | /cookie-jar/:id |
| POST | /cookie-jar |
| PATCH | /cookie-jar/:id |
| DELETE | /cookie-jar/:id |

POST/PATCH body: `{ name }`

## Auth header

```
Authorization: Bearer <access_token>
```

Tokens expire after 24 hours.

## Tests

```bash
npm test           # unit tests
npm run test:e2e   # e2e tests
npm run test:cov   # with coverage
```