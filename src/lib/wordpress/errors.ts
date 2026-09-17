export class WordPressApiError extends Error {
  readonly status: number;
  readonly endpoint: string;
  readonly body?: unknown;

  constructor(message: string, options: { status: number; endpoint: string; body?: unknown }) {
    super(message);
    this.name = "WordPressApiError";
    this.status = options.status;
    this.endpoint = options.endpoint;
    this.body = options.body;
  }
}

export class WordPressTimeoutError extends Error {
  readonly endpoint: string;

  constructor(endpoint: string) {
    super(`WordPress request timed out: ${endpoint}`);
    this.name = "WordPressTimeoutError";
    this.endpoint = endpoint;
  }
}
