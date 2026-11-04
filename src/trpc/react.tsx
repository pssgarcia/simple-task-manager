"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import type { AppRouter } from "@/server/root";
import { makeQueryClient } from "./query-client";

export const api = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [httpBatchLink({ url: "/api/trpc" })],
    }),
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
