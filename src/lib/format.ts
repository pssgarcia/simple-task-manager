const createdAt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

/** Fixed zone so server HTML and the browser render the same string. */
export function formatCreatedAt(timestamp: number) {
  return createdAt.format(timestamp);
}
