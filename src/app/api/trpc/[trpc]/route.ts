import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/root";

/** Node, not Edge, so this route shares the in-memory list with server components. */
export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
