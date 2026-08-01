export interface Quote {
  id: string;
  text: string;
  author: string;
  category: string;
}

export interface Video {
  id: string;
  title: string;
  platform: "YouTube" | "Facebook" | "Shorts";
  duration: string;
  thumbnail: string;
  url: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
}
