# Complaint Box

A full-stack complaint management application where users can post complaints, upvote others' complaints, and administrators can review and delete them from a password-protected admin panel.

## Features

- **Post complaints** – Add a title and detailed description from the home page.
- **Upvote / like complaints** – Like complaints anonymously; each browser is tracked with a unique token so one like per complaint per visitor.
- **Admin panel** – Password-protected control panel (`/admin`) to view and delete complaints.
- **Responsive UI** – Works on mobile, tablet, and desktop.

## Tech Stack

### Frontend (`/client`)
- React 19 + Vite 8
- Tailwind CSS 4
- React Router 8
- Axios (HTTP client)
- React Toastify (notifications)

### Backend (`/server`)
- Node.js + Express 5
- MongoDB + Mongoose 9
- dotenv (environment variables)
- uuid (unique client tokens)

## Project Structure

```
complaint_box/
├── client/                 # Frontend (React + Vite)
│   └── README.md           # Frontend documentation
└── server/                 # Backend (Express + MongoDB)
    └── README.md           # Backend documentation
```

## Quick Start

### 1. Backend

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_box
```

Start the server:

```bash
npm run dev        # runs with nodemon
# or
npm start          # runs with node
```

The API runs on `http://localhost:3000`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs on `http://localhost:5173` and proxies `/api` requests to the backend on port `3000`.

## Usage

| Page       | Route    | Description                                                     |
|------------|----------|-----------------------------------------------------------------|
| Home       | `/`      | View complaints, add new complaints, and like complaints        |
| Admin      | `/admin` | Enter password `anshit` to unlock the panel and delete complaints |

## Documentation

Detailed documentation is split between the two projects:

- [Frontend README →](client/README.md)
- [Backend README →](server/README.md)