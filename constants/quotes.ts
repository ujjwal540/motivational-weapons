import type { Quote } from "@/types";

export const QUOTE_CATEGORIES = [
  "All",
  "Discipline",
  "Resilience",
  "Success",
  "Focus",
  "Self-Belief",
] as const;

export const QUOTES: Quote[] = [
  {
    id: "q1",
    text: "The struggle you are in today is developing the strength you need for tomorrow.",
    author: "Motivational Weapons",
    category: "Resilience",
  },
  {
    id: "q2",
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Motivational Weapons",
    category: "Discipline",
  },
  {
    id: "q3",
    text: "Every rep, every rejection, every rough morning is a weapon being forged.",
    author: "Motivational Weapons",
    category: "Resilience",
  },
  {
    id: "q4",
    text: "You don't need more time. You need more decision.",
    author: "Motivational Weapons",
    category: "Focus",
  },
  {
    id: "q5",
    text: "Success isn't owned, it's leased — and rent is due every single day.",
    author: "Motivational Weapons",
    category: "Success",
  },
  {
    id: "q6",
    text: "Believe you can carry the weight before you're asked to lift it.",
    author: "Motivational Weapons",
    category: "Self-Belief",
  },
  {
    id: "q7",
    text: "Quiet mornings build loud results.",
    author: "Motivational Weapons",
    category: "Discipline",
  },
  {
    id: "q8",
    text: "Pain is temporary feedback. Quitting is a permanent decision.",
    author: "Motivational Weapons",
    category: "Resilience",
  },
  {
    id: "q9",
    text: "Focus is saying no to a hundred good ideas so your best one can win.",
    author: "Motivational Weapons",
    category: "Focus",
  },
];

export const TODAYS_QUOTE: Quote = QUOTES[0];
