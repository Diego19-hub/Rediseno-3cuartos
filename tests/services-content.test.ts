import { beforeEach, describe, expect, it, vi } from "vitest";

const home = vi.hoisted(() => ({ getHomeContent: vi.fn() }));
vi.mock("../src/lib/wordpress/home", () => home);

import { serviceMetadata } from "../src/lib/wordpress/service-metadata";
import { getServicePageContent, getServicesPageContent } from "../src/lib/wordpress/services";

const seo = { title: "", description: "", noindex: false };
const fixture = { source: "wordpress" as const, services: [{ id: 1, slug: "diseno-branding", name: "Diseño y Branding", summary: "Resumen", visualIdentifier: "Módulo 1", description: "Propuesta", capabilities: ["Estrategia"], cta: { label: "Contacto", url: "/#contacto" }, order: 1, seo, isProvisional: true }, { id: 2, slug: "desarrollo-web", name: "Desarrollo Web", summary: "Resumen", visualIdentifier: "Módulo 2", description: "Propuesta", capabilities: [], cta: { label: "", url: "" }, order: 2, seo, isProvisional: true }], caseStudy: { id: 3, slug: "case", title: "Caso", clientName: "Cliente provisional", challenge: "", solution: "", serviceIds: [1], results: [], metrics: [], gallery: [], testimonialId: 4, cta: { label: "", url: "" }, seo, isProvisional: true }, testimonials: [{ id: 4, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: true }], resources: [], settings: { brandName: "", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "", url: "" }, defaultSeo: seo } };

describe("service page content", () => {
  beforeEach(() => home.getHomeContent.mockResolvedValue(fixture));
  it("returns the WordPress service listing", async () => expect((await getServicesPageContent()).services).toHaveLength(2));
  it("resolves a valid slug with related content", async () => { const page = await getServicePageContent("diseno-branding"); expect(page?.service.name).toBe("Diseño y Branding"); expect(page?.testimonial?.id).toBe(4); });
  it("returns null for an unknown slug", async () => expect(await getServicePageContent("inexistente")).toBeNull());
  it("keeps the fallback source when WordPress is unavailable", async () => { home.getHomeContent.mockResolvedValue({ ...fixture, source: "fallback" }); expect((await getServicePageContent("desarrollo-web"))?.source).toBe("fallback"); });
  it("creates basic metadata from a service", () => expect(serviceMetadata(fixture.services[0])).toMatchObject({ title: "Diseño y Branding | 3cuartos", description: "Resumen", robots: { index: true } }));
});
