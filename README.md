# AbleSpace

A full-stack task management application built as a monorepo, following a provided Figma design spec. 
## Tech Stack

**Backend**
- [NestJS](https://nestjs.com/) 11
- MongoDB Atlas via Mongoose 9
- Passport JWT + Google OAuth 2.0
- class-validator / class-transformer for request validation

**Frontend**
- [Next.js](https://nextjs.org/) 16 (App Router) + TypeScript, React 19
- Tailwind CSS v4
- shadcn/ui on the Base UI preset (`@base-ui/react`)
- Zustand (with `persist` middleware) for client state
- Axios for API calls, `react-day-picker` for date pickers

## Project Structure

```
ablespace/
├── backend/
│   └── src/
│       ├── auth/                    # Guest login, Google OAuth, JWT strategy/guard
│       │   └── strategies/          # google.strategy.ts, jwt.strategy.ts, jwt.auth.guard.ts
│       ├── tasks/                   # Tasks CRUD, comments, subtasks
│       │   └── dto/                 # create-task.dto.ts, update-task.dto.ts
│       ├── projects/                # Projects CRUD
│       │   └── dto/                 # create-project.dto.ts, update-project.dto.ts
│       ├── users/                   # User list + profile update
│       ├── schemas/                 # Centralized Mongoose schemas (user, task, project)
│       ├── app.module.ts
│       └── main.ts                  # Bootstrap, CORS, global ValidationPipe
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/login/        # Guest + Google login
        │   ├── auth/callback/       # OAuth token capture
        │   └── (dashboard)/         # tasks, tasks/[id], projects, projects/[id], settings
        ├── components/
        │   ├── auth/  layout/  projects/  tasks/  ui/   # shadcn/ui primitives
        ├── lib/
        │   ├── api/                 # client.ts (axios + interceptor), auth.ts, tasks.ts, projects.ts, users.ts
        │   ├── store/                # authStore.ts, themeStore.ts (Zustand + persist)
        │   ├── types/                # tasks.ts, project.ts, user.ts
        │   └── utils.ts              # cn(), getAvatarUrl()
        └── middleware.ts             # Cookie-based route protection
```

## Data Models

### User (`schemas/user.schema.ts`)
| Field | Type | Notes |
|---|---|---|
| `email` | string | required, unique |
| `password` | string | nullable (guest/OAuth users have none) |
| `fullName` | string | required, defaults to `'Dexter'` |
| `title` | string | |
| `username` | string | |
| `avatarUrl` | string | falls back to DiceBear if empty |
| `isGuest` | boolean | |
| `googleId` | string | nullable |
| `theme` | enum | `light`, `dark` |
| `colorMode` | enum | `amber`, `blue`, `pink`, `rose`, `emerald`, `black` |

### Task (`schemas/task.schema.ts`)
| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | |
| `status` | enum | `To Do`, `Doing`, `Completed`, `On Hold` |
| `priority` | enum | `No Priority`, `Urgent`, `High`, `Medium`, `Low` |
| `members` | ObjectId[] → User | |
| `dueDate` / `startDate` | Date | |
| `labels` / `teams` / `resources` | string[] | |
| `parentTask` | ObjectId → Task | enables subtasks |
| `project` | ObjectId → Project | |
| `reporter` | ObjectId → User | indexed; task owner (not `createdBy`) |
| `comments[]` | `{ author, text, createdAt }` | embedded, appended via `POST /tasks/:id/comments` |
| `updates[]` | `{ field, oldValue, newValue, changedBy, changedAt }` | embedded audit log, auto-populated in `task.service.ts` whenever status/priority change |

### Project (`schemas/project.schema.ts`)
| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `description` | string | |
| `priority` | enum | same set as Task |
| `status` | enum | `Backlog`, `Planned`, `In Progress`, `Completed`, `On Hold` |
| `lead` | ObjectId → User | |
| `reporter` | ObjectId → User | required, indexed |
| `dueDate` | Date | |
| `members` | ObjectId[] → User | |
| `teams` / `labels` | string[] | |

## API Reference

All routes are prefixed with the backend base URL (default `http://localhost:4000`). Routes marked 🔒 require `Authorization: Bearer <jwt>` via `JwtAuthGuard`.

### Auth (`/auth`)
| Method | Route | Description |
|---|---|---|
| POST | `/auth/guest` | Creates/logs in a guest user, returns `access_token` |
| GET | `/auth/google` | Redirects to Google OAuth consent screen |
| GET | `/auth/google/callback` | Google redirect target; issues JWT, redirects to `/auth/callback?token=...` on the frontend |
| GET 🔒 | `/auth/me` | Returns the current user's profile |

### Users (`/users`) — all 🔒
| Method | Route | Description |
|---|---|---|
| GET | `/users` | List all users (used for member pickers) |
| PATCH | `/users/me` | Update the current user's profile |

### Tasks (`/tasks`) — all 🔒
| Method | Route | Description |
|---|---|---|
| POST | `/tasks` | Create a task (see `CreateTaskDto` below) |
| GET | `/tasks` | List tasks, paginated `{ data, meta }`. Query params: `projectId`, `status`, `parentTask`, `page`, `limit` |
| GET | `/tasks/:id` | Get one task |
| PATCH | `/tasks/:id` | Update a task (partial `CreateTaskDto`); status/priority changes are auto-logged to `updates[]` |
| DELETE | `/tasks/:id` | Delete a task |
| POST | `/tasks/:id/comments` | Add a comment — body: `{ text: string }` |

**`CreateTaskDto`**: `title` (required), `description?`, `status?` (enum), `priority?` (enum), `members?` (Mongo IDs), `dueDate?`/`startDate?` (ISO date strings), `labels?`/`teams?`/`resources?` (string arrays), `parentTask?` (Mongo ID), `project?` (Mongo ID).

### Projects (`/projects`) — all 🔒
| Method | Route | Description |
|---|---|---|
| POST | `/projects` | Create a project (see `CreateProjectDto` below) |
| GET | `/projects` | List projects, paginated `{ data, meta }`. Query params: `page`, `limit` |
| GET | `/projects/:id` | Get one project |
| PATCH | `/projects/:id` | Update a project (partial `CreateProjectDto`) |
| DELETE | `/projects/:id` | Delete a project |

**`CreateProjectDto`**: `title` (required), `description?`, `priority?` (enum), `status?` (enum), `lead?` (Mongo ID), `dueDate?` (ISO date string), `members?` (Mongo IDs), `teams?`/`labels?` (string arrays).

> The global `ValidationPipe` runs with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true` — any field not declared in a DTO is stripped, and unknown fields throw a 400.

## Features

### Authentication
- Guest login and Google OAuth flows
- JWT-based auth with route protection via `middleware.ts` (cookies) + an Axios interceptor (`localStorage`)
- `GET /auth/me` for current user

### Tasks
- Kanban board with drag-and-drop, plus list view
- Search and configurable field visibility
- Subtasks (`parentTask`), labels, resources, team tags, member picker (`MemberPicker.tsx`)
- Date pickers, comments, and an auto-tracked `updates[]` activity feed for status/priority changes

### Projects
- Table and detail views
- Role-based membership (reporter, lead, members)

### Settings
- Profile, theme, and color tabs
- Workspace section with Leave Workspace action
- Light/dark mode with 6 accent colors, no flash on load (inline script in `app/layout.tsx` reads `theme-storage` before paint)

### General
- Paginated list endpoints (`{ data, meta }` shape) on tasks and projects
- Global request validation (whitelist, non-whitelisted properties rejected)
- DiceBear-based avatar fallback (`getAvatarUrl()`) for users without a profile picture

## Getting Started

### Prerequisites
- Node.js
- A MongoDB Atlas connection string
- Google OAuth credentials (for Google login)

### Backend Setup
```bash
cd backend
npm install
```
Create `backend/.env`:
```
MONGODB_URI=your-mongodb-atlas-uri
PORT=4000
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
```
```bash
npm run start:dev
```
Backend runs at `http://localhost:4000` (or your `PORT`). CORS is restricted to `FRONTEND_URL` (defaults to `http://localhost:3000`).

### Frontend Setup
```bash
cd frontend
npm install
```
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
```bash
npm run dev
```
Frontend runs at `http://localhost:3000`.

### Other scripts
| Location | Command | Description |
|---|---|---|
| backend | `npm run build` | Compile with `nest build` |
| backend | `npm run test` / `test:e2e` / `test:cov` | Jest unit/e2e/coverage |
| backend | `npm run lint` | ESLint with `--fix` |
| frontend | `npm run build` | Production build |
| frontend | `npm run lint` | ESLint |

## Notes for Contributors

- Task type file is named `tasks.ts` (plural), under `frontend/src/lib/types/`.
- The members picker component is `MemberPicker.tsx` (singular), not `MembersPicker`.
- The user schema lives at `backend/src/schemas/user.schema.ts`, not inside the `users/` module folder — all Mongoose schemas are centralized under `src/schemas/`.
- Task ownership uses the `reporter` field, not `createdBy`.
- With the shadcn/ui Base UI preset, `DropdownMenuTrigger` does not support `asChild`; apply `className` directly to the trigger instead of wrapping a `Button`.
- The `Select` component's `onValueChange` is typed as `(value: string | null) => void`; handle and guard against `null` before casting.
- Type-only imports require `import type` due to `nodenext` module resolution.
- If guest login starts failing with a duplicate-key error, check for a stale unique index on `username` in Atlas and drop it — the schema only enforces uniqueness on `email`.

## License

This project was built as an assignment and is not currently licensed for public distribution.