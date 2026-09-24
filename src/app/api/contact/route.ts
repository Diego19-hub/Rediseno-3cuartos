import { NextResponse } from "next/server";
import { validateContactPayload } from "@/lib/contact/validation";
import { ContactConfigurationError, submitContactRequest, WordPressContactError } from "@/lib/wordpress/contact";
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }
  const validation = validateContactPayload(body);
  if (!validation.ok) return NextResponse.json({ error: "validation_failed", fields: validation.errors }, { status: 400 });
  try { const result = await submitContactRequest(validation.data); return NextResponse.json({ success: true, id: result.id }, { status: 201 }); }
  catch (error) {
    if (error instanceof ContactConfigurationError) {
      console.error("[contact] Configuration error");
      return NextResponse.json(
        { error: "contact_unavailable" },
        { status: 503 },
      );
    }

    if (error instanceof WordPressContactError) {
      console.error("[contact] WordPress request failed:", {
        status: error.status,
      });

      return NextResponse.json(
        { error: "contact_delivery_failed" },
        { status: 502 },
      );
    }

    console.error("[contact] Unexpected error:", error);

    return NextResponse.json(
      { error: "contact_unavailable" },
      { status: 500 },
    );
  }
}
