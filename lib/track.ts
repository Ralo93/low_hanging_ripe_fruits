function getSessionId(): string {
  let id = sessionStorage.getItem("session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("session_id", id);
  }
  return id;
}

export function track(eventType: string, metadata?: Record<string, unknown>): void {
  try {
    const session_id = getSessionId();
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, event_type: eventType, metadata }),
    }).catch(() => {}); // fire-and-forget, never throw
  } catch {
    // sessionStorage unavailable (SSR guard)
  }
}
