# Loop

Loop is a private music streaming application scaffold for exactly two users.

## Tech Stack

- Backend: FastAPI + Python
- Frontend: React + Vite + TypeScript
- Database: SQLite
- Deployment: one Docker container

## Project Structure

```text
Loop/
├── backend/
│   └── app/
│       ├── database/
│       ├── models/
│       ├── routes/
│       └── services/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       └── pages/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Notes

- The app is intentionally lightweight for a small server.
- No features, authentication, or Android app are implemented yet.
- The frontend structure is kept compatible with a later Capacitor conversion.