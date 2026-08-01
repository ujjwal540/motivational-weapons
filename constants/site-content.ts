import type { FaqItem, StatItem, Testimonial } from "@/types";

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aashish R.",
    role: "Follower since 2024",
    quote:
      "Motivational Weapons is the first page that made discipline feel like strength, not punishment.",
    initials: "AR",
  },
  {
    id: "t2",
    name: "Priya K.",
    role: "Small business owner",
    quote:
      "The daily quotes are short enough to actually read and sharp enough to actually stick.",
    initials: "PK",
  },
  {
    id: "t3",
    name: "Bikash T.",
    role: "Student & athlete",
    quote:
      "I forwarded one post to my whole team before finals. Everyone showed up different the next day.",
    initials: "BT",
  },
];

export const STATS: StatItem[] = [
  { id: "s1", label: "Followers", value: "45K+" },
  { id: "s2", label: "Posts Published", value: "681+" },
  { id: "s3", label: "Daily Reach", value: "12K+" },
  { id: "s4", label: "Years Forging", value: "3+" },
];

export const FAQS: FaqItem[] = [
  {
    id: "f1",
    question: "What is Motivational Weapons?",
    answer:
      "Motivational Weapons is a daily motivation platform — quotes, videos, and stories built to help you turn struggle into strength, one decision at a time.",
  },
  {
    id: "f2",
    question: "How often is new content posted?",
    answer:
      "New quotes and posts go out daily, with longer videos and blog articles published multiple times a week.",
  },
  {
    id: "f3",
    question: "Can I submit my own success story?",
    answer:
      "Yes. Use the contact form and tell us your story — we regularly feature real reader stories across our platform and social pages.",
  },
  {
    id: "f4",
    question: "Do you offer one-on-one coaching?",
    answer:
      "Not yet — but it's on the roadmap. Join the newsletter to be the first to know when coaching and courses launch.",
  },
  {
    id: "f5",
    question: "Is Motivational Weapons free to follow?",
    answer:
      "100%. All quotes, videos, and blog posts are free. Optional premium content and courses are planned for the future.",
  },
];
