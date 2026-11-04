# Prisma Access Traffic Log Portal

Prisma Access / Cortex Data Lake Traffic Log Viewer

## Features

- Traffic Log Search
- Allow / Deny Filter
- Source IP Filter
- Destination IP Filter
- User Filter
- Rule Filter
- Session Reason Filter
- Auto Refresh
- Traffic Detail Expansion
- Bytes / Packets Statistics

---

## Architecture

```text
Prisma Access
      |
      v
FastAPI Backend
      |
      v
React Frontend
```

---

## Screenshots

### Main View

- Time
- Source IP
- Destination IP
- App
- Action
- Rule
- Bytes
- Reason

### Detail View

- Protocol
- URL Category
- Zone Information
- Packets
- Bytes
- Session Details

---

## Backend

### FastAPI

Port:

```text
28000
```

Run:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 28000
```

---

## Frontend

### React + Vite

Port:

```text
30000
```

Run:

```bash
npm install
npm run dev
```

---

## Docker

Start:

```bash
docker compose up -d --build
```

Stop:

```bash
docker compose down
```

Logs:

```bash
docker logs prisma-backend
docker logs prisma-frontend
```

---

## Configuration

Create:

```bash
backend/.env
```

Example:

```env
CLIENT_ID=
CLIENT_SECRET=
TSG_ID=
AUTH_URL=
CDL_URL=
```

---

## API

### Health

```http
GET /api/health
```

### Traffic Logs

```http
GET /api/logs/traffic
```

Parameters:

| Parameter | Description |
|------------|------------|
| action | allow / deny |
| source_ip | Source IP |
| dest_ip | Destination IP |
| user | User |
| rule | Policy Rule |
| reason | Session Reason |
| limit | Number of rows |

Example:

```http
/api/logs/traffic?action=deny&limit=50
```

---

## Future Enhancements

- CSV Export
- Destination Port Filter
- Dark Mode
- Authentication
- Panorama Integration

---

## Disclaimer

This project is intended for Prisma Access visibility and operational monitoring.
