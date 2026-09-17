import { beforeEach, describe, expect, it, vi } from "vitest";

const queries = vi.hoisted(() => ({
  getServices: vi.fn(), getCaseStudies: vi.fn(), getTestimonials: vi.fn(), getResources: vi.fn(), getGlobalSettings: vi.fn(),
}));
vi.mock("../src/lib/wordpress/queries", () => queries);

import { getHomeContent } from "../src/lib/wordpress/home";

const settings = { brandName: "3cuartos", contact: { publicEmail: "contacto@ejemplo.local", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "Cuéntanos tu proyecto", url: "#contacto" }, defaultSeo: { title: "", description: "", noindex: true } };

describe("Home WordPress content", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queries.getServices.mockResolvedValue({ items: [{ id: 2, name: "Web", slug: "web", summary: "", visualIdentifier: "", description: "", capabilities: [], cta: { label: "", url: "" }, order: 2, seo: settings.defaultSeo, isProvisional: true }, { id: 1, name: "Branding", slug: "branding", summary: "", visualIdentifier: "", description: "", capabilities: [], cta: { label: "", url: "" }, order: 1, seo: settings.defaultSeo, isProvisional: true }] });
    queries.getCaseStudies.mockResolvedValue({ items: [{ id: 3, slug: "case", title: "Caso", clientName: "Cliente provisional", challenge: "", solution: "", serviceIds: [], results: [], metrics: [], gallery: [], cta: { label: "", url: "" }, seo: settings.defaultSeo, isProvisional: true }] });
    queries.getTestimonials.mockResolvedValue({ items: [{ id: 4, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: true }] });
    queries.getResources.mockResolvedValue({ items: [{ id: 5, slug: "resource", title: "Recurso", excerpt: "", featuredExcerpt: "Extracto", content: "", cta: { label: "", url: "" }, readingTime: 0, publishedAt: "" }] });
    queries.getGlobalSettings.mockResolvedValue(settings);
  });

  it("uses normalized WordPress content in editorial order", async () => {
    const content = await getHomeContent();
    expect(content.source).toBe("wordpress");
    expect(content.services.map((service) => service.id)).toEqual([1, 2]);
    expect(content.resources).toHaveLength(1);
  });

  it("falls back safely when WordPress is unavailable", async () => {
    queries.getServices.mockRejectedValue(new Error("offline"));
    const content = await getHomeContent();
    expect(content.source).toBe("fallback");
    expect(content.services).toHaveLength(3);
    expect(content.services.every((service) => service.isProvisional)).toBe(true);
  });
});
