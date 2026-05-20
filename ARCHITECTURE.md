# ARCHITECTURE.md — Cybernauts Network

## 3 Key Design Tradeoffs

---

### Tradeoff 1: MongoDB over PostgreSQL

**Decision:** Chose MongoDB (Mongoose) over PostgreSQL.

**Why:**
- Users have dynamic hobby arrays and friend ID arrays — these map naturally to MongoDB documents without join tables.
- Schema flexibility allowed rapid iteration during development (adding `feedbackData`, `popularityScore` fields without migrations).
- MongoDB Atlas provides free-tier cloud hosting which simplified deployment.

**Cost:**
- No referential integrity enforcement at DB level — application must manually prevent orphaned friend references.
- Complex graph queries (mutual friends, 2nd-degree connections) are harder to express in MongoDB aggregation than in SQL JOINs.

---

### Tradeoff 2: Hybrid Recommendation Engine (Graph + Semantic) over Pure Collaborative Filtering

**Decision:** Built a hybrid engine combining graph signals (mutual friends, shared hobbies, proximity) with semantic text similarity on hobby strings.

**Why:**
- Pure collaborative filtering requires large datasets to work well — with small user counts it gives poor results.
- Graph signals (mutual friends count, shared hobbies) are computable instantly without training data.
- Semantic similarity on hobby text catches near-matches ("Gaming" ↔ "Video Games") that exact-match misses.

**Cost:**
- More complex codebase — two signal sources must be weighted and merged.
- Semantic similarity is approximated with string distance (not true embeddings) for performance reasons.

---

### Tradeoff 3: React Context + useReducer over Redux Toolkit

**Decision:** Used React Context with useReducer for global state instead of Redux Toolkit.

**Why:**
- Project scope does not require Redux middleware (thunks, sagas) — all async is handled in custom hooks.
- Context + useReducer has zero extra dependencies and less boilerplate for a medium-complexity app.
- Easier to reason about for reviewers unfamiliar with Redux patterns.

**Cost:**
- No built-in Redux DevTools support for time-travel debugging.
- Context re-renders all consumers on every dispatch — acceptable at this scale but would need optimization (useMemo, splitting contexts) at 1000+ users.

---

## 2 Rejected Alternatives

---

### Rejected: Neo4j as the Database

**What it is:** A native graph database purpose-built for nodes and relationships.

**Why it was considered:**
- The core data model IS a graph (users = nodes, friendships = edges) — Neo4j's Cypher query language is perfect for mutual friend queries and shortest-path calculations.

**Why it was rejected:**
- Neo4j free tier (AuraDB) has connection limits and cold-start latency that would hurt demo performance.
- Team familiarity with MongoDB + Mongoose was much higher — faster to implement correctly under a 2-day deadline.
- The assignment explicitly listed MongoDB as an option, reducing risk.

---

### Rejected: Redux Toolkit for State Management

**What it is:** The official recommended way to write Redux logic with less boilerplate.

**Why it was considered:**
- Better DevTools support (Redux DevTools Extension).
- Built-in `createAsyncThunk` for standardized async handling.
- Industry standard for large React apps.

**Why it was rejected:**
- Adds `@reduxjs/toolkit` and `react-redux` as dependencies.
- For this app's complexity level, the boilerplate of slices, actions, and selectors outweighs the benefits.
- React Context + useReducer achieves the same result with code that is easier to read and review quickly.