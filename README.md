# simple-task-manager

A small Next.js task list. Tasks stay in memory on the server and the UI calls them through tRPC, so the browser and the server share the same types.

## How it works

- The list page is server-rendered. It preloads the first page of tasks, then the browser asks for the next pages as you scroll.
- Procedures live in `src/server/tasks/router.ts`: create, list, update, delete, plus `byId` for the edit form.
- Zod rejects a missing title and an empty id. Updating or deleting an unknown id returns "Task not found."
- The store is a process-local array (`src/server/tasks/store.ts`). Saving a file in dev does not wipe it. Restarting the server loads the sample tasks again.
- This expects one Node server. A multi-instance deploy would not share the list.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

To check a production build:

```bash
npm run build
npm start
```
