# DEBUG_NOTES.md — Cybernauts Network

## Bug 1: `state.users.find is not a function` — Frontend Crash on Load

### Symptom
On initial page load, the entire UI crashed with:
```
Uncaught TypeError: state.users.find is not a function
    at UserPanel (UserPanel.tsx:15)
```
The graph canvas showed a white screen and no users were displayed.

### Root Cause
The backend returns all API responses wrapped in an envelope:
```json
{ "success": true, "data": [...] }
```
The frontend `api.ts` was using `axios`'s `.data` property directly:
```ts
api.get<User[]>('/users').then((r) => r.data)
```
This meant `r.data` = `{ success: true, data: [...] }` — an **object**, not an array.
When `GraphContext` stored this object as `state.users`, calling `.find()` on it threw a TypeError because objects don't have array methods.

### Fix
Added an `unwrap()` helper in `api.ts` that checks for the `{ data: [...] }` envelope and extracts the inner array:
```ts
function unwrap(res: any): any {
  const d = res.data;
  if (d && typeof d === 'object' && 'data' in d) return d.data;
  return d;
}
```
Also added a `normalizeUsers()` function in `GraphContext.tsx` that defensively handles any response shape (array, `{ data }`, `{ users }`) and filters out non-user documents (auth-only records without a `username` field).

---

## Bug 2: Duplicate & Circular Friendship Created in DB

### Symptom
When User A linked to User B, and then User B tried to link to User A, a second separate friendship record was created. This meant:
- The graph showed two edges between A and B
- Popularity scores were double-counted
- The `/api/graph` endpoint returned duplicate edges

### Root Cause
The link route handler only checked if `targetUserId` existed in the **source user's** `friends` array:
```ts
if (user.friends.includes(targetUserId)) {
  throw new ConflictError('Already linked');
}
```
It did NOT check if the source user already existed in the **target user's** `friends` array. So A→B and B→A were treated as two separate links.

### Fix
Updated the link controller to perform a **bidirectional check** before creating the friendship:
```ts
const alreadyLinked =
  sourceUser.friends.includes(targetId) ||
  targetUser.friends.includes(sourceUserId);

if (alreadyLinked) {
  return res.status(409).json({
    success: false,
    message: 'Friendship already exists between these users'
  });
}
```
Then both users' `friends` arrays are updated atomically using `Promise.all()`:
```ts
await Promise.all([
  User.findByIdAndUpdate(sourceId, { $addToSet: { friends: targetId } }),
  User.findByIdAndUpdate(targetId, { $addToSet: { friends: sourceId } }),
]);
```
`$addToSet` provides an additional safety net at the database level — it only adds the ID if it doesn't already exist in the array.