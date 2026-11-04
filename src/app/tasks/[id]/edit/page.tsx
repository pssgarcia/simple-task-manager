import type { Metadata } from "next";
import { notFound, unstable_rethrow } from "next/navigation";
import { TRPCError } from "@trpc/server";
import { TaskForm } from "@/components/task-form";
import { api } from "@/trpc/server";
import { TRPCProvider } from "@/trpc/react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Edit task",
};

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // notFound() has to run outside catch. Next treats it as a crash otherwise.
  let task;
  try {
    task = await api.task.byId({ id });
  } catch (error) {
    unstable_rethrow(error);
    if (!(error instanceof TRPCError) || error.code !== "NOT_FOUND") {
      throw error;
    }
    task = null;
  }

  if (!task) {
    notFound();
  }

  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-ink">Edit task</h1>
      <TRPCProvider>
        <TaskForm task={task} />
      </TRPCProvider>
    </section>
  );
}
