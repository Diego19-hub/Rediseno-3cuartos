import { describe, expect, it } from "vitest";
import { collectionEndpoint } from "../src/lib/wordpress/endpoints";
import { WordPressApiError } from "../src/lib/wordpress/errors";
import { service } from "../src/lib/wordpress/normalizers";

describe("WordPress adapter", () => {
  it("normalizes provisional services without exposing raw REST fields", () => {
    expect(service({ id: 1, slug: "branding", title: { rendered: "Branding" }, meta: { "3cuartos_is_provisional": true } })).toMatchObject({ id: 1, name: "Branding", isProvisional: true });
    expect(service({ id: 2, slug: "web", title: { rendered: "Web" }, meta: { "3cuartos_is_provisional": "1" } }).isProvisional).toBe(true);
  });
  it("uses WordPress full-size media for service heroes when available", () => {
    const normalized = service({
      id: 3,
      slug: "marketing",
      title: { rendered: "Marketing" },
      _embedded: { "wp:featuredmedia": [{
        id: 30,
        source_url: "https://cms.test/marketing-150x100.jpg",
        alt_text: "Marketing",
        media_details: {
          width: 150,
          height: 100,
          sizes: { full: { source_url: "https://cms.test/marketing.jpg", width: 1800, height: 1200 } },
        },
      }] },
    });

    expect(normalized.image).toMatchObject({ url: "https://cms.test/marketing.jpg", width: 1800, height: 1200 });
  });
  it("keeps the original media URL and dimensions if WordPress has no full-size variant", () => {
    const normalized = service({
      id: 4,
      slug: "branding",
      title: { rendered: "Branding" },
      _embedded: { "wp:featuredmedia": [{
        id: 40,
        source_url: "https://cms.test/branding.jpg",
        alt_text: "Branding",
        media_details: { width: 179, height: 119, sizes: { thumbnail: { width: 150, height: 100 } } },
      }] },
    });

    expect(normalized.image).toMatchObject({ url: "https://cms.test/branding.jpg", width: 179, height: 119 });
  });
  it("bounds pagination and encodes safe query parameters", () => {
    expect(collectionEndpoint("services", { page: 0, perPage: 200, search: "web & strategy" })).toBe("wp/v2/services?page=1&per_page=100&search=web+%26+strategy");
  });
  it("keeps typed REST failure metadata", () => {
    const error = new WordPressApiError("Not found", { status: 404, endpoint: "wp/v2/services" });
    expect(error.status).toBe(404);
  });
});
