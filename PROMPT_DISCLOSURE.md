# PROMPT_DISCLOSURE.md — AI Tools Disclosure

## AI Tools Used

| Tool | Purpose |
|---|---|
| Claude (Anthropic) | Frontend code generation, debugging, document writing |
| GitHub Copilot | Inline code suggestions during backend development |

---

## Prompts Used

### 1. Frontend Scaffold
**Prompt:**
> "See this folder structure I created already for the full backend. Give me all frontend files code at once. Read the assignment and give me only frontend complete code for each file."

**What was accepted:**
- Complete file structure for all 21 frontend files
- React Flow custom node components (HighScoreNode, LowScoreNode)
- GraphContext with useReducer pattern
- All custom hooks (useUsers, useGraph, useRecommendations)
- UI components (Toast, Spinner, ErrorBoundary, ConfirmModal)

**What was rejected / manually modified:**
- `onNodeDrop` prop on ReactFlow — not a valid prop, removed manually
- Auto-layout position logic was adjusted to better space nodes
- CSS color variables tweaked for better contrast

---

### 2. Bug Fix — state.users TypeError
**Prompt:**
> "Uncaught TypeError: state.users.find is not a function — fix this"

**What was accepted:**
- `unwrap()` helper function in api.ts
- `normalizeUsers()` in GraphContext
- Username filter to exclude auth-only MongoDB documents

**What was rejected:**
- Suggested adding a loading skeleton — skipped for time

---

### 3. API Response Normalization
**Prompt:**
> "Backend sends { success: true, data: [...] } — user created undefined showing"

**What was accepted:**
- Full rewrite of api.ts with unwrap helper
- Type update to include both `id` and `_id` fields

---

### 4. Document Generation
**Prompt:**
> "Generate ARCHITECTURE.md, DEBUG_NOTES.md, PROMPT_DISCLOSURE.md, README.md, swagger.yaml, .env.example for submission"

**What was accepted:**
- All document structures and content

**What was manually edited:**
- Specific bug details verified against actual bugs encountered
- Deployed URLs updated with real Vercel link
- MongoDB URI replaced with placeholder in .env.example

---

## What Was Built Without AI

- MongoDB schema design and relationship modeling
- Popularity score formula implementation
- Jest test cases (conflict, relationship, popularity)
- Backend route structure and controller logic
- `.env` configuration and deployment setup on Railway/Render
- Git history and repository management