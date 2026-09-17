import { WordPressApiError, WordPressTimeoutError } from "./errors";

const defaultTimeout = 8_000;

function baseUrl(): string {
  const value = process.env.WORDPRESS_REST_URL || process.env.WORDPRESS_URL;
  if (!value) throw new Error("WORDPRESS_REST_URL or WORDPRESS_URL must be configured on the server.");
  return value.replace(/\/$/, "");
}

export async function wordpressFetch<T>(endpoint: string, init: RequestInit = {}): Promise<{ data: T; response: Response }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), defaultTimeout);
  const url = new URL(endpoint.replace(/^\//, ""), `${baseUrl()}/`).toString();

  try {
    const response = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...init.headers },
      signal: controller.signal,
      next: { revalidate: 300, ...init.next },
    });
    const body: unknown = await response.json().catch(() => undefined);
    if (!response.ok) {
      throw new WordPressApiError(`WordPress request failed with ${response.status}.`, { status: response.status, endpoint, body });
    }
    return { data: body as T, response };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new WordPressTimeoutError(endpoint);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
