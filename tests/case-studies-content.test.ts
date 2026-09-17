import { beforeEach, describe, expect, it, vi } from "vitest";

const queries = vi.hoisted(() => ({ getCaseStudies: vi.fn(), getServices: vi.fn(), getTestimonials: vi.fn(), getGlobalSettings: vi.fn() }));
const home = vi.hoisted(() => ({ getHomeContent: vi.fn() }));
vi.mock("../src/lib/wordpress/queries", () => queries);
vi.mock("../src/lib/wordpress/home", () => home);

import { caseStudyMetadata } from "../src/lib/wordpress/case-study-metadata";
import { getCaseStudiesContent, getCaseStudyPageContent } from "../src/lib/wordpress/case-studies";

const seo = { title: "", description: "", noindex: false };
const caseStudy = { id: 1, slug: "caso-provisional-identidad", title: "Caso provisional — identidad", content: "Estrategia", clientName: "Cliente provisional", challenge: "Contexto", objectives: ["Objetivo"], solution: "Solución", serviceIds: [2], results: ["Resultado provisional"], metrics: [{ label: "Métrica provisional", value: "Pendiente", context: "Validar" }], gallery: [], testimonialId: 3, cta: { label: "Ver caso", url: "/casos-de-exito/caso-provisional-identidad" }, seo, isProvisional: true };
const settings = { brandName: "", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "", url: "" }, defaultSeo: seo };

describe("case studies content", () => {
  beforeEach(() => { vi.resetAllMocks(); queries.getCaseStudies.mockResolvedValue({ items: [caseStudy] }); queries.getServices.mockResolvedValue({ items: [{ id: 2, slug: "diseno-branding", name: "Diseño y Branding", summary: "", visualIdentifier: "", description: "", capabilities: ["Estrategia"], cta: { label: "", url: "" }, order: 1, seo, isProvisional: true }] }); queries.getTestimonials.mockResolvedValue({ items: [{ id: 3, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: true }] }); queries.getGlobalSettings.mockResolvedValue(settings); home.getHomeContent.mockResolvedValue({ services: [], testimonials: [], settings, source: "fallback" }); });
  it("returns the CMS listing and preserves provisional state", async () => { const content = await getCaseStudiesContent(); expect(content.cases).toHaveLength(1); expect(content.cases[0].isProvisional).toBe(true); });
  it("resolves a valid case with its relation", async () => expect((await getCaseStudyPageContent(caseStudy.slug))?.testimonial?.id).toBe(3));
  it("returns null for an unknown slug", async () => expect(await getCaseStudyPageContent("inexistente")).toBeNull());
  it("uses fallback content if WordPress fails", async () => { queries.getCaseStudies.mockRejectedValue(new Error("offline")); const content = await getCaseStudiesContent(); expect(content.source).toBe("fallback"); expect(content.cases.every((item) => item.isProvisional)).toBe(true); });
  it("produces noindex-aware metadata", () => expect(caseStudyMetadata(caseStudy)).toMatchObject({ title: "Caso provisional — identidad | 3cuartos", description: "Solución", robots: { index: true } }));
});
