import Link from "next/link";

export default function EditTaskNotFound() {
  return (
    <section className="space-y-3">
      <h1 className="text-xl font-semibold text-ink">Task not found</h1>
      <p className="text-sm text-muted">
        That id is not in the list. It may have been deleted.
      </p>
      <Link
        href="/"
        className="inline-block text-sm font-semibold text-accent underline-offset-2 hover:underline"
      >
        Back to the list
      </Link>
    </section>
  );
}
