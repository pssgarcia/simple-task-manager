import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TASK_PAGE_SIZE } from "@/lib/constants";
import { publicProcedure, router } from "../trpc";
import {
  InvalidCursorError,
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from "./store";

const titulo = z
  .string({ required_error: "Title is required." })
  .trim()
  .min(1, "Title is required.")
  .max(120, "Title must be at most 120 characters.");

const descricao = z
  .string()
  .trim()
  .max(2000, "Description must be at most 2000 characters.")
  .optional();

const id = z
  .string({ required_error: "Task id is required." })
  .trim()
  .min(1, "Task id is required.");

function missingTask() {
  return new TRPCError({
    code: "NOT_FOUND",
    message: "Task not found.",
  });
}

export const taskRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(TASK_PAGE_SIZE),
        cursor: z.string().min(1).nullish(),
      }),
    )
    .query(({ input }) => {
      try {
        return listTasks(input.limit, input.cursor);
      } catch (error) {
        if (error instanceof InvalidCursorError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Could not continue the list from that point. Refresh the page.",
          });
        }
        throw error;
      }
    }),

  /** Used by the edit screen. Unknown ids fail with a clear not-found error. */
  byId: publicProcedure.input(z.object({ id })).query(({ input }) => {
    const task = getTask(input.id);
    if (!task) {
      throw missingTask();
    }
    return task;
  }),

  create: publicProcedure
    .input(z.object({ titulo, descricao }))
    .mutation(({ input }) => createTask(input)),

  update: publicProcedure
    .input(z.object({ id, titulo, descricao }))
    .mutation(({ input }) => {
      const task = updateTask(input);
      if (!task) {
        throw missingTask();
      }
      return task;
    }),

  delete: publicProcedure.input(z.object({ id })).mutation(({ input }) => {
    const task = deleteTask(input.id);
    if (!task) {
      throw missingTask();
    }
    return task;
  }),
});
