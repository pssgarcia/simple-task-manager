import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";
import { appRouter } from "@/server/root";
import { createCallerFactory } from "@/server/trpc";
import { makeQueryClient } from "./query-client";

/**
 * One query client per request. The page prefetches into it,
 * then HydrateClient ships that cache to the browser.
 */
const getQueryClient = cache(makeQueryClient);
const caller = createCallerFactory(appRouter)({});

export const { trpc: api, HydrateClient } = createHydrationHelpers<
  typeof appRouter
>(caller, getQueryClient);
