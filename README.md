# 🌐 Cybernauts Network — AI-Powered User Relationship & Hobby Graph

A full-stack application that manages users, friendships, and hobbies using a dynamic graph visualization with an AI-assisted hybrid recommendation engine.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [Recommendation Engine](#recommendation-engine)
- [Business Logic](#business-logic)
- [Running Tests](#running-tests)
- [Bonus Features](#bonus-features)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB (Mongoose ODM) |
| Frontend | React + TypeScript + Vite |
| Graph UI | React Flow |
| State Management | React Context API |
| Testing | Jest + Supertest |
| API Docs | Swagger / Postman |

---

## 📁 Project Structure

```
cybernauts-network/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                      # MongoDB connection
│   │   ├── models/
│   │   │   └── User.ts                    # Mongoose User schema
│   │   ├── routes/
│   │   │   ├── userRoutes.ts              # User + friendship + recommendation routes
│   │   │   └── graphRoutes.ts             # Graph data route
│   │   ├── controllers/
│   │   │   ├── userController.ts          # User CRUD + link/unlink logic
│   │   │   ├── graphController.ts         # Graph nodes + edges builder
│   │   │   └── recommendationController.ts # Recommendation + feedback
│   │   ├── services/
│   │   │   ├── popularityService.ts       # Score computation
│   │   │   ├── recommendationService.ts   # Hybrid recommendation engine
│   │   │   └── embeddingService.ts        # TF-IDF semantic similarity
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts            # Global error handler
│   │   │   └── validate.ts                # Request validation
│   │   ├── utils/
│   │   │   └── helpers.ts                 # UUID, score helpers
│   │   └── index.ts                       # Express entry point
│   ├── tests/
│   │   ├── popularity.test.ts             # Score logic tests
│   │   ├── relationship.test.ts           # Link/unlink API tests
│   │   └── conflict.test.ts               # Deletion conflict tests
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── graph/                     # React Flow nodes & edges
│   │   │   ├── sidebar/                   # Draggable hobbies sidebar
│   │   │   ├── panels/                    # User form + recommendations panel
│   │   │   └── ui/                        # Toast, Spinner, ErrorBoundary
│   │   ├── context/
│   │   │   └── GraphContext.tsx           # Global state management
│   │   ├── hooks/                         # Custom API hooks
│   │   ├── services/
│   │   │   └── api.ts                     # Axios API layer
│   │   ├── types/
│   │   │   └── index.ts                   # TypeScript interfaces
│   │   └── utils/
│   │       └── debounce.ts                # Debounce utility
│   └── ...vite config files
│
├── ARCHITECTURE.md
├── DEBUG_NOTES.md
├── PROMPT_DISCLOSURE.md
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) v9+
- [MongoDB](https://www.mongodb.com/) (local) **or** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster URI

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/cybernauts-network.git
cd cybernauts-network
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```bash
cp backend/.env.example backend/.env
```

Then fill in the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cybernauts
NODE_ENV=development
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster.mongodb.net/cybernauts`

---

## ▶️ Running the App

### Start Backend (Development)

```bash
cd backend
npm run dev
```

Server runs at: `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /api/health
```

---

### 👤 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Fetch all users |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user (must unlink first) |

#### POST `/api/users` — Request Body
```json
{
  "username": "Alice",
  "age": 25,
  "hobbies": ["chess", "reading"]
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "username": "Alice",
    "age": 25,
    "hobbies": ["chess", "reading"],
    "friends": [],
    "popularityScore": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 🤝 Friendships

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/:id/link` | Create a friendship |
| DELETE | `/api/users/:id/unlink` | Remove a friendship |

#### POST `/api/users/:id/link` — Request Body
```json
{
  "friendId": "target-user-uuid"
}
```

#### DELETE `/api/users/:id/unlink` — Request Body
```json
{
  "friendId": "target-user-uuid"
}
```

---

### 🕸 Graph

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/graph` | Get all nodes and edges |

#### Response
```json
{
  "success": true,
  "data": {
    "nodes": [
      { "id": "uuid", "username": "Alice", "age": 25, "hobbies": ["chess"], "popularityScore": 3 }
    ],
    "edges": [
      { "source": "uuid-alice", "target": "uuid-bob" }
    ]
  }
}
```

---

### 🤖 Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id/recommendations` | Get top 5 friend + hobby recommendations |
| POST | `/api/users/:id/recommendations/feedback` | Submit accept/reject feedback |

#### GET Response
```json
{
  "success": true,
  "data": {
    "friendRecommendations": [
      {
        "userId": "uuid",
        "username": "Charlie",
        "score": 4.5,
        "reason": "Recommended because: 2 mutual friend(s), 3 shared hobby(s)",
        "sourceSignals": ["2 mutual friend(s)", "3 shared hobby(s)"]
      }
    ],
    "hobbyRecommendations": [
      {
        "hobby": "gaming",
        "score": 3.0,
        "reason": "2 of your friend(s) have this hobby",
        "sourceSignals": ["friend frequency: 2"]
      }
    ]
  }
}
```

#### POST Feedback — Request Body
```json
{
  "type": "friend",
  "value": "target-user-uuid",
  "action": "accept"
}
```

> `action` can be `"accept"` or `"reject"`
> `type` can be `"friend"` or `"hobby"`

---

### ❌ Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Validation error |
| 404 | User not found |
| 409 | Conflict (duplicate friendship, deletion blocked) |
| 500 | Internal server error |

---

## 🧠 Recommendation Engine

The recommendation engine uses a **hybrid approach**:

### Friend Recommendations
| Signal | Weight | Description |
|--------|--------|-------------|
| Mutual Friends | 2x | Number of common friends |
| Shared Hobbies | 1.5x | Directly matching hobbies |
| Semantic Similarity | 3x | TF-IDF cosine similarity of hobby interests |
| Feedback Boost | 1.5x | Boost for previously accepted recommendations |

### Hobby Recommendations
- Based on frequency of hobbies among friends that the user doesn't already have
- Rejected hobbies are filtered out from future suggestions

### Feedback Loop
- `accept` → boosts the recommendation in future rankings
- `reject` → filters the recommendation from future results
- Scores recompute on: friendship changes, hobby updates, feedback submission

---

## 📊 Business Logic

### Popularity Score Formula
```
popularityScore = number of friends + (total shared hobbies with friends × 0.5)
```

### Deletion Rules
- A user **cannot be deleted** while connected as a friend to others
- Must call `DELETE /api/users/:id/unlink` for all friendships first

### Duplicate & Circular Friendship Prevention
- `A → B` and `B → A` are stored as **one mutual connection**
- Attempting to re-link the same two users returns `409 Conflict`

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

### Test Coverage

| Test File | What It Tests |
|-----------|--------------|
| `popularity.test.ts` | Score formula, shared hobby count |
| `relationship.test.ts` | Link/unlink API, duplicate prevention |
| `conflict.test.ts` | Block delete when friends exist, allow after unlink |

---

## 🌟 Bonus Features

- **Custom React Flow Nodes** — `HighScoreNode` (score > 5) and `LowScoreNode` (score ≤ 5) with smooth animated transitions
- **Draggable Hobby Sidebar** — Drag a hobby onto a user node to assign it instantly
- **Debounced API Calls** — Hobby updates and recommendation calls are debounced to avoid excessive requests
- **Undo/Redo** — Node move and connection history (bonus)
- **Development Mode** — `ts-node-dev` with `--respawn` for hot reload

---

## 📬 Postman Collection

Import the Postman collection from `swagger.yaml` or use the base URL `http://localhost:5000/api` with the endpoints documented above.

---

## 👤 Author

**Manish**
Cybernauts Development Assignment — Full Stack (Node.js + MongoDB + React + TypeScript)