import { TaskList } from "@/components/task-list";
import { TASK_PAGE_SIZE } from "@/lib/constants";
import { api, HydrateClient } from "@/trpc/server";
import { TRPCProvider } from "@/trpc/react";

// Each request reads the in-memory list. A static page would freeze it at build time.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const NOTICES = {
  created: "Task created.",
  updated: "Task updated.",
} as const;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  const message =
    notice && notice in NOTICES
      ? NOTICES[notice as keyof typeof NOTICES]
      : undefined;

  await api.task.list.prefetchInfinite({ limit: TASK_PAGE_SIZE });

  return (
    <TRPCProvider>
      <HydrateClient>
        <TaskList notice={message} />
      </HydrateClient>
    </TRPCProvider>
  );
}
