# B2B SaaS Taskboard

A multi-tenant task management app with a Kanban board interface, org-based access control, and Clerk Billing integration.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, React Router v7, Clerk React |
| Backend | FastAPI, SQLAlchemy, SQLite |
| Auth | Clerk (JWT + org permissions) |
| Billing | Clerk Billing (via Svix webhooks) |

---

## Project Structure

```
B2B_SaaS/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── task.py       # CRUD endpoints for tasks
│   │   │   └── webhook.py    # Clerk billing webhook handler
│   │   ├── core/
│   │   │   ├── auth.py       # JWT validation & permission guards
│   │   │   ├── clerk.py      # Clerk SDK client
│   │   │   ├── config.py     # Settings (env vars)
│   │   │   └── database.py   # SQLAlchemy engine & session
│   │   ├── models/
│   │   │   └── task.py       # Task ORM model
│   │   ├── schemas/
│   │   │   └── task.py       # Pydantic request/response schemas
│   │   └── main.py           # FastAPI app + middleware
│   └── pyproject.toml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── KanbanBoard.jsx
    │   │   ├── TaskColumn.jsx
    │   │   ├── TaskForm.jsx
    │   │   ├── Taskcard.jsx
    │   │   └── Layout.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── PricingPage.jsx
    │   │   ├── SignInPage.jsx
    │   │   └── SignUp.jsx
    │   └── services/     # API call helpers
    └── package.json
```

---

## Features

- **Org-based multi-tenancy** — tasks are scoped per Clerk organization
- **Role-based access** — view / create / edit / delete permissions enforced via Clerk org roles
- **Kanban board** — drag-and-drop columns (Todo → In Progress → Done)
- **Billing tiers** — Free (2 members) / Pro (unlimited), controlled via Clerk Billing webhooks

---

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # fill in env vars
uv run uvicorn app.main:app --reload
```

**Required env vars:**
```
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=sqlite:///./taskboard.db
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in env vars
npm run dev
```

**Required env vars:**
```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:8000
```

---

## Webhook Events

The `/api/webhooks/clerk` endpoint handles Clerk Billing events:

| Event | Action |
|---|---|
| `subscription.created` | Set org member limit based on plan |
| `subscription.updated` | Update org member limit |
| `subscriptionItem.canceled` | Reset org to free tier limit |
| `subscriptionItem.ended` | Reset org to free tier limit |
