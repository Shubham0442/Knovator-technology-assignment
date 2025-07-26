# Job Importer System

This project is a real-time job feed importer built using ReactJS, Node.js, Express, MongoDB, Redis and Bull Queue. It fetches jobs from external RSS feeds, processes them using background workers, logs the import history, and updates the frontend in real time via Socket.IO.

---

## Features

- Cron-based job fetching from external RSS APIs
- Job processing using Bull queue & Redis
- MongoDB-based job storage with deduplication
- Import logs with stats: total, new, updated, failed
- Real-time updates on frontend using Socket.IO
- Retry + exponential backoff for failed jobs

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Shubham0442/Knovator-technology-assignment.git
```

### 2. Install Dependencies (server)

```bash
cd server/
npm install
```

### 3. Create .env File

```bash
PORT=5050
REDIS_PORT=6380
REDIS_HOST=127.0.0.1
MONGODB_URL=MongoDB Atlus URL String
```

### 4. Start Redis Server (Windows)

```bash
redis-server --port 6380
```

### 5. Start Server

```bash
npm run start
```

### 6. Install Dependencies (client)

```bash
cd client/
npm install
```

### 7. Run application on Frontent

```bash
npm run dev
```

## Key Architecture Decisions

### Job Queue with Bull

- **Reason**: Redis-backed queues (via Bull) help offload job processing from the main thread, support retries, and allow scaling.
- **Processing**:
  - workers/jobProcessor.js listens to the jobQueue.
  - It either creates or updates jobs in MongoDB, or logs failures to the ImportLog.

---

### Cron Scheduling

- We use node-cron to schedule job fetching every hour:
- The cron triggers runImportJob() which:
- Parses job feeds
- Creates a new ImportLog entry
- Queues each job with its metadata for processing

---

### Real-Time Updates

The backend emits Socket.IO events:

- job-new
- job-updated
- job-failed

The frontend subscribes to these events and updates the UI in real time.

- connect
- get_import_logs
- disconnect

---

## Assumptions

- RSS feeds return standard XML format with:
- guid, link, title, pubDate, etc.
- jobId is uniquely derived from guid or link.
- Redis server is assumed to be running on port 6380 (customizable via .env).
- Jobs are deduplicated using jobId.

---

## Tech Stack used:
- ReactJS
- Ant Design
- Node.js
- Web Sockets
- Expressjs
- MongoDB
- Redis
- bull
- mongoose
- 

## Future Enhancements

- Add authentication
- UI to view logs with pagination
- Redis-based caching for improved performance
- Dashboard for job processing statistics

