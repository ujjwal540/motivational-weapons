const FALLBACK_RESPONSES = [
  "You do not need to solve everything today. Name the hardest part, choose one action that takes ten minutes, and do that before making a bigger plan.",
  "Start with the smallest move you can repeat: drink water, clear one surface, send one message, or work for ten focused minutes. Momentum is built through proof, not pressure.",
  "A difficult season is not a final judgment about your life. Separate what you can control today from what you cannot, then take one useful step inside your control.",
  "When motivation is missing, lower the size of the task instead of lowering your standards. Open the document, make the call, or take the first rep. The next step becomes clearer after you begin.",
] as const;

export function getFallbackMotivation(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes("stuck") || normalized.includes("overwhelmed")) {
    return "Feeling stuck usually means the next step is too large or too unclear. Write down the problem in one sentence, choose the smallest part you can influence, and spend ten minutes on only that part.";
  }
  if (normalized.includes("failure") || normalized.includes("failed")) {
    return "A failed attempt is information, not an identity. Keep what you learned, change one part of the approach, and make the next attempt smaller and more specific.";
  }
  if (normalized.includes("discipline") || normalized.includes("motivation")) {
    return "Do not wait for the feeling to arrive. Pick one visible action, set a ten-minute timer, and begin. Discipline grows each time you keep a promise to yourself.";
  }
  return FALLBACK_RESPONSES[message.length % FALLBACK_RESPONSES.length];
}