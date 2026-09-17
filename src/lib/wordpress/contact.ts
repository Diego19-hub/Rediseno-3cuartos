import type { ContactPayload } from "../contact/validation";
export class ContactConfigurationError extends Error {}
export class WordPressContactError extends Error { constructor(public status: number) { super("WordPress contact request failed"); } }
export async function submitContactRequest(payload: ContactPayload): Promise<{ id: number }> {
  const base = process.env.WORDPRESS_REST_URL || process.env.WORDPRESS_URL;
  const username = process.env.WP_CONTACT_USERNAME;
  const password = process.env.WP_CONTACT_APP_PASSWORD;
  if (!base || !username || !password) throw new ContactConfigurationError("Contact integration is not configured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const auth = Buffer.from(`${username}:${password}`).toString("base64");
    const response = await fetch(`${base.replace(/\/$/, "")}/3cuartos/v1/contact`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Basic ${auth}` }, body: JSON.stringify(payload), cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new WordPressContactError(response.status);
    const body = await response.json().catch(() => ({}));
    return { id: Number(body?.id ?? 0) };
  } catch (error) {
    if (error instanceof ContactConfigurationError || error instanceof WordPressContactError) throw error;
    throw new WordPressContactError(502);
  } finally { clearTimeout(timeout); }
}
