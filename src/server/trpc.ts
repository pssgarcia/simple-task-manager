import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";

/**
 * Shared tRPC setup. Zod issues become the message the UI shows,
 * instead of a generic "input invalid" string.
 */
const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    const zodError = error.cause instanceof ZodError ? error.cause : null;
    const firstIssue = zodError?.issues[0]?.message;

    return {
      ...shape,
      message: firstIssue ?? shape.message,
      data: {
        ...shape.data,
        zodError: zodError ? zodError.flatten() : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
