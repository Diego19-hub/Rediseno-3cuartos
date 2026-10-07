import { beforeEach, describe, expect, it, vi } from "vitest";

const home = vi.hoisted(() => ({ getFallbackServices: vi.fn(), getFallbackSettings: vi.fn() }));
const queries = vi.hoisted(() => ({ getServices: vi.fn(), getGlobalSettings: vi.fn(), getCaseStudies: vi.fn(), getTestimonials: vi.fn() }));
vi.mock("../src/lib/wordpress/home", () => home);
vi.mock("../src/lib/wordpress/queries", () => queries);

import { serviceMetadata } from "../src/lib/wordpress/service-metadata";
import { getServicePageContent, getServicesPageContent } from "../src/lib/wordpress/services";

const seo = { title: "", description: "", noindex: false };
const fixture = { source: "wordpress" as const, services: [{ id: 1, slug: "diseno-branding", name: "Diseño y Branding", summary: "Resumen", visualIdentifier: "Módulo 1", description: "Propuesta", capabilities: ["Estrategia"], cta: { label: "Contacto", url: "/#contacto" }, order: 1, seo, isProvisional: false }, { id: 2, slug: "desarrollo-web", name: "Desarrollo Web", summary: "Resumen", visualIdentifier: "Módulo 2", description: "Propuesta", capabilities: [], cta: { label: "", url: "" }, order: 2, seo, isProvisional: false }, { id: 3, slug: "marketing-provisional", name: "Marketing", summary: "Resumen", visualIdentifier: "", description: "", capabilities: [], cta: { label: "", url: "" }, order: 3, seo, isProvisional: true }], caseStudy: { id: 3, slug: "case", title: "Caso", clientName: "Cliente", challenge: "", solution: "", serviceIds: [1], results: [], metrics: [], gallery: [], testimonialId: 4, cta: { label: "", url: "" }, seo, isProvisional: false }, testimonials: [{ id: 4, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: false }], resources: [], settings: { brandName: "", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "", url: "" }, defaultSeo: seo } };

describe("service page content", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    home.getFallbackServices.mockReturnValue(fixture.services);
    home.getFallbackSettings.mockReturnValue(fixture.settings);
    queries.getServices.mockResolvedValue({ items: fixture.services });
    queries.getGlobalSettings.mockResolvedValue(fixture.settings);
    queries.getCaseStudies.mockResolvedValue({ items: [fixture.caseStudy] });
    queries.getTestimonials.mockResolvedValue({ items: fixture.testimonials });
  });
  it("returns every service received from the published WordPress endpoint", async () => expect((await getServicesPageContent()).services).toHaveLength(3));
  it("resolves a valid slug with related content", async () => { const page = await getServicePageContent("diseno-branding"); expect(page?.service.name).toBe("Diseño y Branding"); expect(page?.testimonial?.id).toBe(4); });
  it("returns null for an unknown slug", async () => expect(await getServicePageContent("inexistente")).toBeNull());
  it("does not render editorial service fallbacks when WordPress is unavailable", async () => { queries.getServices.mockRejectedValue(new Error("offline")); queries.getGlobalSettings.mockRejectedValue(new Error("offline")); expect((await getServicesPageContent()).services).toEqual([]); expect((await getServicePageContent("desarrollo-web"))).toBeNull(); });
  it("creates basic metadata from a service", () => expect(serviceMetadata(fixture.services[0])).toMatchObject({ title: "Diseño y Branding | 3cuartos", description: "Resumen", robots: { index: true } }));
});
