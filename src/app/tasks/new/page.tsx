import type { Metadata } from "next";
import { TaskForm } from "@/components/task-form";
import { TRPCProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "New task",
};

export default function NewTaskPage() {
  return (
    <section>
      <h1 className="mb-4 text-xl font-semibold text-ink">New task</h1>
      <TRPCProvider>
        <TaskForm />
      </TRPCProvider>
    </section>
  );
}
