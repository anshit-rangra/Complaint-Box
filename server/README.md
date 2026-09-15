# Complaint Box — Backend

REST API for the Complaint Box application, built with Express and MongoDB. It handles complaint creation, retrieval, unique-per-device likes, client token generation, and complaint deletion used by the admin panel.

- **Location:** `server/`
- **Port:** `3000`

## Tech Stack

| Tool          | Version   | Purpose                             |
|---------------|-----------|-------------------------------------|
| Node.js       | 18+       | Runtime                             |
| Express       | ^5.2.1    | HTTP framework / routing            |
| Mongoose      | ^9.10.0   | MongoDB ODM (models & connection)   |
| dotenv        | ^17.4.2   | Environment variable loading        |
| uuid          | ^14.0.2   | Unique client tokens                |

## Getting Started

### Prerequisites

- Node.js (18+)
- A MongoDB instance (local `mongod` or MongoDB Atlas)

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server/` directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/complaint_box
```

For MongoDB Atlas, use your connection string instead:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/complaint_box
```

`MONGODB_URI` is read in `src/config/config.js` and exposed via the `config` object.

### 3. Run the Server

```bash
npm run dev        # start with nodemon (auto-restart on changes)
```

Or run without reloading:

```bash
npm start          # node src/server.js
```

A successful startup logs:

```
Database connected sucessfully !
Server is running on port 3000
```

## Scripts

| Script  | Description                          |
|---------|--------------------------------------|
| `start` | Start with `node src/server.js`      |
| `dev`   | Start with `nodemon` (auto-restart)  |
| `test`  | Placeholder (no tests configured)    |

## Project Structure

```
src/
├── app/
│   └── app.js                     # Express app, JSON middleware, route mounting
├── config/
│   ├── config.js                  # Reads env vars into a config object
│   └── db.js                      # Mongoose connection logic
├── controllers/
│   └── complaints.controller.js   # Request handlers for all complaint routes
├── models/
│   ├── complaint.model.js         # Complaint schema (title, description, likes)
│   └── like.model.js              # Like schema (complaint ref + user token)
├── routes/
│   └── complaint.routes.js        # Route definitions
└── server.js                      # Entry point: connect DB, listen on port 3000
```

## API Reference

All routes are mounted under `/api/complaint`:

| Method | Endpoint                        | Description                                                   |
|--------|---------------------------------|---------------------------------------------------------------|
| POST   | `/api/complaint/post`           | Create a new complaint                                        |
| POST   | `/api/complaint/like/:complaintId` | Toggle a like on a complaint for the requesting device     |
| GET    | `/api/complaint/id`             | Generate a unique UUID client token                           |
| GET    | `/api/complaint/get`            | Fetch complaints (with pagination)                            |
| DELETE | `/api/complaint/delete/:id`     | Delete a complaint (admin panel)                              |

### POST `/api/complaint/post`

Create a complaint.

**Body (JSON):**

```json
{
  "title": "Leaky tap",
  "description": "The tap in the washroom has been leaking for days."
}
```

**Responses:**

- `201 Created`
  ```json
  {
    "message": "Complaint added successfully",
    "complaint": {
      "_id": "650f...",
      "title": "Leaky tap",
      "description": "The tap in the washroom has been leaking for days.",
      "likes": 0,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```
- `400 Bad Request` — title/description missing (`Title and description are required`)
- `500 Internal Server Error`

### POST `/api/complaint/like/:complaintId`

Toggle a like for the requesting device. The device is identified by a custom `token` header (obtained from `GET /api/complaint/id`).

**Headers:**

```json
{ "token": "a-uuid-from-the-id-endpoint" }
```

**Behavior:**

- If no like exists for this `token` + `complaintId`, one is created and `likes` is incremented.
- If a like already exists, it is removed and `likes` is decremented.

**Responses:**

- `201 Created`
  ```json
  { "message": "Like added sucessfully", "cmd": "added" }
  ```
  or
  ```json
  { "message": "Like remove sucessfully", "cmd": "remove" }
  ```
- `404 Not Found` — missing `token` header (`Token not found !`) or unknown complaint (`Complaint not found`)
- `500 Internal Server Error`

### GET `/api/complaint/id`

Generate a unique client token. The frontend stores this in `localStorage` and sends it back as the `token` header when liking.

**Response:**

```json
{ "message": "Id created sucessfully", "token": "<uuid-v4>" }
```

### GET `/api/complaint/get?limit=10&page=1`

Fetch complaints sorted by likes (highest first) with pagination.

**Query parameters:**

| Param   | Type   | Default | Description            |
|---------|--------|---------|------------------------|
| `limit` | number | `10`    | Number of complaints    |
| `page`  | number | `1`     | Page number (1-based)   |

**Response:**

```json
{
  "message": "Complaints fetch sucessfully",
  "data": {
    "complaints": [ /* complaint documents */ ],
    "total": 42,
    "page": 1
  }
}
```

- `500 Internal Server Error`

### DELETE `/api/complaint/delete/:id`

Delete a complaint by id (used by the admin panel).

**Responses:**

- `200 OK`
  ```json
  { "message": "Complaint deleted sucessfully" }
  ```
- `500 Internal Server Error`

## Data Models

### Complaint (`complaints` collection)

| Field         | Type     | Required | Default | Notes                    |
|---------------|----------|----------|---------|--------------------------|
| `title`       | String   | yes      | —       | Complaint title          |
| `description` | String   | yes      | —       | Complaint details        |
| `likes`       | Number   | no       | `0`     | Like counter             |
| `createdAt`   | Date     | —        | —       | Added by `timestamps`    |
| `updatedAt`   | Date     | —        | —       | Added by `timestamps`    |

### Like (`likes` collection)

| Field      | Type     | Required | Notes                              |
|------------|----------|----------|------------------------------------|
| `complaint`| ObjectId | no       | `ref: "complaints"`                |
| `user`     | String   | yes      | Client token that registered the like |

## How It Works

1. **Client token** — The frontend requests a UUID from `GET /api/complaint/id`. This token is not an authentication system; it uniquely identifies a device so that likes are counted once per complaint per device.
2. **Likes toggle** — On each like request, the server looks up a Like where `{ user: token, complaint: complaintId }`. Existence toggles the counter on the Complaint.
3. **Pagination** — `getComplaints` computes `skip = (page - 1) * limit` and returns the matching slice of complaints sorted by `likes` descending.
4. **Deletion** — `deleteComplaint` removes the complaint document by `_id`. (Related like documents are left as orphans; cleanup is a possible future improvement.)

## Configuration

Environment variables are loaded via dotenv in `src/config/config.js`:

| Variable      | Required | Description        |
|---------------|----------|--------------------|
| `MONGODB_URI` | yes      | MongoDB connection string |

The server listens on a fixed port: `3000` (set in `src/server.js`). CORS is not currently configured because the frontend proxies API calls through the Vite dev server. If you serve the frontend from a different origin in production, add `cors` middleware accordingly.