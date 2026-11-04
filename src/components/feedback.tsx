export type Feedback = {
  type: "success" | "error";
  message: string;
};

export function FeedbackBanner({ feedback }: { feedback: Feedback | null }) {
  if (!feedback) {
    return null;
  }

  const isError = feedback.type === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={
        isError
          ? "rounded-md border border-danger/20 bg-danger-bg px-3 py-2 text-sm text-danger"
          : "rounded-md border border-ok/20 bg-ok-bg px-3 py-2 text-sm text-ok"
      }
    >
      {feedback.message}
    </p>
  );
}
