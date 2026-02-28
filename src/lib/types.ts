export type Stage =
  | "triggered"
  | "researching"
  | "writing"
  | "generating_images"
  | "complete"
  | "error";

export interface GoogleNewsArticle {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export interface ResearchData {
  perplexity: string;
  citations: string[];
  googleNews: GoogleNewsArticle[];
}

export interface NewsletterSection {
  title: string;
  body: string;
  image_prompt: string;
  image_search_query: string;
}

export interface NewsletterData {
  headline: string;
  subtitle: string;
  sections: NewsletterSection[];
  closing: string;
  linkedin_post: string;
}

export interface Session {
  sessionId: string;
  brandName: string;
  brandDescription: string;
  stage: Stage;
  createdAt: number;
  updatedAt: number;
  research: ResearchData | null;
  newsletter: NewsletterData | null;
  htmlEmail: string | null;
  linkedinPost: string | null;
  emailSubject: string | null;
  error: string | null;
}

export interface WebhookUpdatePayload {
  sessionId: string;
  stage: Stage;
  research?: ResearchData;
  newsletter?: NewsletterData;
  htmlEmail?: string;
  linkedinPost?: string;
  emailSubject?: string;
  error?: string;
}
