import { router } from "./trpc";
import { taskRouter } from "./tasks/router";

export const appRouter = router({
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
