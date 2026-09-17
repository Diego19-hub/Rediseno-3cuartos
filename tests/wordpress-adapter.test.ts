import { describe, expect, it } from "vitest";
import { collectionEndpoint } from "../src/lib/wordpress/endpoints";
import { WordPressApiError } from "../src/lib/wordpress/errors";
import { service } from "../src/lib/wordpress/normalizers";

describe("WordPress adapter", () => {
  it("normalizes provisional services without exposing raw REST fields", () => {
    expect(service({ id: 1, slug: "branding", title: { rendered: "Branding" }, meta: { "3cuartos_is_provisional": true } })).toMatchObject({ id: 1, name: "Branding", isProvisional: true });
    expect(service({ id: 2, slug: "web", title: { rendered: "Web" }, meta: { "3cuartos_is_provisional": "1" } }).isProvisional).toBe(true);
  });
  it("bounds pagination and encodes safe query parameters", () => {
    expect(collectionEndpoint("services", { page: 0, perPage: 200, search: "web & strategy" })).toBe("wp/v2/services?page=1&per_page=100&search=web+%26+strategy");
  });
  it("keeps typed REST failure metadata", () => {
    const error = new WordPressApiError("Not found", { status: 404, endpoint: "wp/v2/services" });
    expect(error.status).toBe(404);
  });
});
