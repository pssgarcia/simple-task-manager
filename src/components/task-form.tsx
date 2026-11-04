"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Task } from "@/server/tasks/types";
import { api } from "@/trpc/react";
import { FeedbackBanner, type Feedback } from "./feedback";

type Props = {
  task?: Task;
};

export function TaskForm({ task }: Props) {
  const router = useRouter();
  const utils = api.useUtils();
  const [titulo, setTitulo] = useState(task?.titulo ?? "");
  const [descricao, setDescricao] = useState(task?.descricao ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const isEdit = Boolean(task);

  const create = api.task.create.useMutation();
  const update = api.task.update.useMutation();
  const pending = create.isPending || update.isPending;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const tituloLimpo = titulo.trim();
    if (!tituloLimpo) {
      setTitleError("Enter a title.");
      return;
    }

    setTitleError(null);
    const payload = {
      titulo: tituloLimpo,
      descricao: descricao.trim(),
    };

    try {
      if (task) {
        await update.mutateAsync({ id: task.id, ...payload });
      } else {
        await create.mutateAsync(payload);
      }
      await utils.task.list.invalidate();
      router.push(task ? "/?notice=updated" : "/?notice=created");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save the task.";
      setFeedback({ type: "error", message });
      if (message.toLowerCase().includes("title")) {
        setTitleError(message);
      }
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FeedbackBanner feedback={feedback} />

      <div className="space-y-1.5">
        <label htmlFor="titulo" className="block text-sm font-medium text-ink">
          Title
        </label>
        <input
          id="titulo"
          name="titulo"
          value={titulo}
          onChange={(event) => {
            setTitulo(event.target.value);
            if (titleError) {
              setTitleError(null);
            }
          }}
          disabled={pending}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "titulo-erro" : undefined}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none ring-accent/30 focus:ring-2 disabled:opacity-60"
          placeholder="e.g. Review the short film script"
        />
        {titleError ? (
          <p id="titulo-erro" role="alert" className="text-sm text-danger">
            {titleError}
          </p>
        ) : (
          <p className="text-xs text-muted">Required.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-ink"
        >
          Description
        </label>
        <textarea
          id="descricao"
          name="descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          disabled={pending}
          rows={4}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-ink outline-none ring-accent/30 focus:ring-2 disabled:opacity-60"
          placeholder="Optional notes"
        />
        <p className="text-xs text-muted">Optional.</p>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Saving…" : isEdit ? "Save changes" : "Create task"}
        </button>
      </div>
    </form>
  );
}
