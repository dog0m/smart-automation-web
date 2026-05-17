export interface ScrapeSelector {
  key: string;
  selector: string;
}

export interface ScrapeRequest {
  url: string;
  selectors: Record<string, string>;
}

export interface ScrapeResult {
  url: string;
  data: Record<string, string | string[] | null>;
  html?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}
