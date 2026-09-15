# Complaint Box — Frontend

React-based user interface for the Complaint Box application, built with Vite. It handles viewing, posting, liking, and admin deletion of complaints, backed by the API server in the `server/` directory.

- **Location:** `client/`
- **Package manager:** npm

## Tech Stack

| Tool            | Version | Purpose                          |
|-----------------|---------|----------------------------------|
| React           | ^19.2.8 | UI library                      |
| Vite            | ^8.3.0  | Build tooling & dev server      |
| Tailwind CSS    | ^4.3.3  | Styling (via `@tailwindcss/vite`) |
| React Router    | ^8.3.1  | Client-side routing             |
| Axios           | ^1.20.0 | HTTP requests to the API        |
| React Toastify  | ^11.1.0 | Toast notifications             |

## Getting Started

### Prerequisites

- Node.js (18+)
- The backend server running on port `3000` (see the [Server README](../server/README.md))

### Install & Run

```bash
cd client
npm install
npm run dev
```

The dev server runs on `http://localhost:5173`. API calls to `/api/*` are proxied to `http://localhost:3000` (configured in `vite.config.js`).

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` folder. Preview the build locally with:

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

> Note: the current repo has a few pre-existing ESLint warnings/errors in context files and `complaintApi.jsx` (unused imports / fast-refresh context exports) that are unrelated to the app features.

## Scripts

| Script    | Description                                  |
|-----------|----------------------------------------------|
| `dev`     | Start the Vite dev server with HMR           |
| `build`   | Create a production build in `dist/`         |
| `preview` | Serve the production build locally           |
| `lint`    | Run ESLint against the source                |

## Project Structure

```
src/
├── app/
│   └── App.jsx                 # App root: providers + routes + ToastContainer
├── components/
│   ├── Form.jsx                # "Add Complaint" modal (title + description)
│   └── Navbar.jsx              # Top navigation bar
├── context/
│   ├── ComplaintsContext.jsx   # Holds complaints list + total + setter
│   └── TokenContext.jsx        # Holds the client's unique token
├── pages/
│   ├── Home.jsx                # Home page (list, like button, add form)
│   └── Admin.jsx               # Admin panel (password gate + delete)
├── routes/
│   └── AppRoutes.jsx           # React Router setup (`/` and `/admin`)
├── services/
│   └── api/
│       ├── axios.jsx           # Shared Axios instance (base URL /api)
│       ├── authApi.jsx         # Device token API (`getId`)
│       └── complaintApi.jsx    # Complaint API calls (get/post/like/delete)
├── utils/
│   ├── helperFunction.jsx      # ReadMoreText component + word limit helper
│   └── token.jsx               # useHydrateToken hook (localStorage token)
├── index.css                   # Tailwind entry stylesheet
└── main.jsx                    # React DOM entry point
```

## Routing

Routes are defined in `src/routes/AppRoutes.jsx` using React Router's `createBrowserRouter`:

| Route    | Component | Description                                      |
|----------|-----------|--------------------------------------------------|
| `/`      | `Home`    | Recent complaints, like button, add-complaint form |
| `/admin` | `Admin`   | Password gate + complaint deletion panel          |

## Data Management

### ComplaintsContext

`ComplaintsContext` fetches the complaints once on mount (via `getComplaints()`) and stores:

```js
{
  complaints: [...],  // array of complaint documents
  total: 0,           // total number of complaints
  page: 1             // current page
}
```

Consumers update this state after posting, liking, or deleting so the UI stays in sync without a full reload. Export pattern:

```js
import { complaintsContext } from '../context/ComplaintsContext'
```

### TokenContext & useHydrateToken

- Each browser receives a unique UUID token from the backend.
- `useHydrateToken()` (in `utils/token.jsx`) is called inside `AppRoutes`. It:
  1. Checks `localStorage` for an existing `token`.
  2. If missing, calls `GET /api/complaint/id` to fetch a fresh UUID.
  3. Stores it in `localStorage` and registers it in `TokenContext`.

This token is sent as the `token` header when liking a complaint, ensuring one like per complaint per device.

## Key Features

### Posting a Complaint

The `Navbar` "Add Complaint" button opens the `Form` modal. `Form` calls `postComplaint(title, description)` and then prepends the new complaint to `ComplaintsContext` state and increments the total.

### Liking a Complaint

On the home page, each complaint card has a like button. Clicking it:

1. Calls `likeComplaint(id)` which `POST`s to `/api/complaint/like/:complaintId` with the device token header.
2. On success (`added` / `remove`), the local count is incremented/decremented and the context state is updated.

### Admin Panel (Password Protected)

The `Admin` page shows a password gate before the complaint list:

- Default password: **`anshit`** (constant `ADMIN_PASSWORD` in `Admin.jsx`).
- Correct password sets `admin_unlocked = "true"` in `localStorage`, persisting the session across refreshes.
- A **Lock** button clears that flag and re-locks the panel.

Once unlocked, each complaint card has a **Delete** button (trash icon) that:

1. Calls `deleteComplaint(id)` → `DELETE /api/complaint/delete/:id`.
2. Filters the complaint out of the context state and decrements the total.

## API Service Layer

| Function            | Method | Endpoint                             | Notes                            |
|---------------------|--------|--------------------------------------|----------------------------------|
| `getId()`           | GET    | `/api/complaint/id`                  | Returns a fresh UUID token       |
| `getComplaints()`   | GET    | `/api/complaint/get?limit&page`      | Defaults: limit `10`, page `1`   |
| `postComplaint()`   | POST   | `/api/complaint/post`                | Sends `{ title, description }`   |
| `likeComplaint(id)` | POST   | `/api/complaint/like/:complaintId`   | Sends device `token` header      |
| `deleteComplaint()` | DELETE | `/api/complaint/delete/:id`          | Deletes a complaint              |

The shared Axios instance (`services/api/axios.jsx`) uses:

- `baseURL: "http://localhost:5173/api"` (proxied to the backend)
- `withCredentials: true`
- `Content-Type: application/json`

## Styling

- Tailwind CSS 4 configured via the `@tailwindcss/vite` plugin in `vite.config.js`.
- Dark theme (slate/indigo/purple) defined through utility classes directly in JSX.
- The app is responsive: containers use `px-4 sm:px-6`, cards collapse to a single column on mobile, and the like/delete buttons widen on small screens.