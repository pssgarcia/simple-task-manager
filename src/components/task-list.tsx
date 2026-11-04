"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TASK_PAGE_SIZE } from "@/lib/constants";
import { formatCreatedAt } from "@/lib/format";
import { api } from "@/trpc/react";
import { FeedbackBanner, type Feedback } from "./feedback";

type Props = {
  notice?: string;
};

/**
 * The first page arrives already hydrated from the server.
 * Further pages are requested when the sentinel scrolls into view.
 */
export function TaskList({ notice }: Props) {
  const [feedback, setFeedback] = useState<Feedback | null>(
    notice ? { type: "success", message: notice } : null,
  );
  const utils = api.useUtils();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const query = api.task.list.useInfiniteQuery(
    { limit: TASK_PAGE_SIZE },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    },
  );

  const remove = api.task.delete.useMutation({
    onSuccess: async () => {
      setFeedback({ type: "success", message: "Task deleted." });
      await utils.task.list.invalidate();
    },
    onError: (error) => {
      setFeedback({ type: "error", message: error.message });
    },
  });

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const tasks = query.data?.pages.flatMap((page) => page.items) ?? [];
  const pendingId = remove.isPending ? remove.variables?.id : undefined;

  return (
    <div className="space-y-4">
      <FeedbackBanner feedback={feedback} />

      {query.isLoading ? (
        <p className="text-sm text-muted">Loading tasks…</p>
      ) : null}

      {query.isError && tasks.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-line bg-card p-4">
          <p role="alert" className="text-sm text-danger">
            {query.error.message}
          </p>
          <button
            type="button"
            className="text-sm font-semibold text-accent underline-offset-2 hover:underline"
            onClick={() => void query.refetch()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {!query.isLoading && tasks.length === 0 && !query.isError ? (
        <div className="rounded-lg border border-dashed border-line bg-card px-4 py-8 text-center">
          <p className="text-ink">No tasks yet.</p>
          <Link
            href="/tasks/new"
            className="mt-3 inline-block text-sm font-semibold text-accent underline-offset-2 hover:underline"
          >
            Create the first one
          </Link>
        </div>
      ) : null}

      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-lg border border-line bg-card px-4 py-3"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-ink">
                  {task.titulo}
                </h2>
                {task.descricao ? (
                  <p className="mt-1 text-sm text-muted">{task.descricao}</p>
                ) : null}
                <time
                  dateTime={new Date(task.dataCriacao).toISOString()}
                  className="mt-2 block text-xs text-muted"
                >
                  Created {formatCreatedAt(task.dataCriacao)}
                </time>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className="inline-flex items-center rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-danger/30 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger-bg disabled:opacity-60"
                  disabled={pendingId === task.id}
                  onClick={() => remove.mutate({ id: task.id })}
                >
                  {pendingId === task.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {query.isFetchNextPageError ? (
        <p role="alert" className="text-sm text-danger">
          Could not load more tasks.{" "}
          <button
            type="button"
            className="font-semibold underline-offset-2 hover:underline"
            onClick={() => void fetchNextPage()}
          >
            Try again
          </button>
        </p>
      ) : null}

      {isFetchingNextPage ? (
        <p className="text-sm text-muted">Loading more tasks…</p>
      ) : null}

      {!hasNextPage && tasks.length > 0 ? (
        <p className="text-center text-xs text-muted">End of the list.</p>
      ) : null}

      <div ref={sentinelRef} className="h-1" aria-hidden="true" />
    </div>
  );
}
