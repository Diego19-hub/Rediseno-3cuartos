import { beforeEach, describe, expect, it, vi } from "vitest";

const queries = vi.hoisted(() => ({ getCaseStudies: vi.fn(), getServices: vi.fn(), getTestimonials: vi.fn(), getGlobalSettings: vi.fn(), getTestimonialById: vi.fn() }));
const home = vi.hoisted(() => ({ getHomeContent: vi.fn() }));
vi.mock("../src/lib/wordpress/queries", () => queries);
vi.mock("../src/lib/wordpress/home", () => home);

import { caseStudyMetadata } from "../src/lib/wordpress/case-study-metadata";
import { getCaseStudiesContent, getCaseStudyPageContent } from "../src/lib/wordpress/case-studies";

const seo = { title: "", description: "", noindex: false };
const caseStudy = { id: 1, slug: "caso-identidad", title: "Caso de identidad", content: "Estrategia", clientName: "Cliente", challenge: "Contexto", objectives: ["Objetivo"], solution: "Solución", serviceIds: [2], results: ["Resultado"], metrics: [{ label: "Conversión", value: "18%", context: "Periodo medido" }], gallery: [], testimonialId: 3, cta: { label: "Ver caso", url: "/casos-de-exito/caso-identidad" }, seo, isProvisional: false };
const settings = { brandName: "", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "", url: "" }, defaultSeo: seo };

describe("case studies content", () => {
  beforeEach(() => { vi.resetAllMocks(); queries.getCaseStudies.mockResolvedValue({ items: [caseStudy, { ...caseStudy, id: 8, slug: "draft-case", isProvisional: true }] }); queries.getServices.mockResolvedValue({ items: [{ id: 2, slug: "diseno-branding", name: "Diseño y Branding", summary: "", visualIdentifier: "", description: "", capabilities: ["Estrategia"], cta: { label: "", url: "" }, order: 1, seo, isProvisional: false }] }); queries.getTestimonials.mockResolvedValue({ items: [{ id: 3, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: false }] }); queries.getGlobalSettings.mockResolvedValue(settings); queries.getTestimonialById.mockResolvedValue({ id: 3, quote: "Cita", personName: "Persona", jobTitle: "Rol", company: "", order: 1, isProvisional: false }); home.getHomeContent.mockResolvedValue({ services: [], testimonials: [], settings, source: "fallback" }); });
  it("returns all records received from WordPress without interpreting their names or editorial flags", async () => { const content = await getCaseStudiesContent(); expect(content.cases).toHaveLength(2); expect(content.cases[1].isProvisional).toBe(true); });
  it("preserves published cases and testimonials even when their text says demo", async () => {
    queries.getCaseStudies.mockResolvedValue({ items: [{ ...caseStudy, id: 12, slug: "natuo-demo", title: "Natuo — Demo", clientName: "Natuo", testimonialId: undefined }] });
    queries.getTestimonials.mockResolvedValue({ items: [{ id: 13, quote: "Demo: proyecto completo", personName: "Persona", jobTitle: "Rol", company: "Natuo", caseStudyId: 12, order: 1, isProvisional: true }] });
    const content = await getCaseStudiesContent();
    expect(content.cases[0].slug).toBe("natuo-demo");
    expect(content.testimonials[0].id).toBe(13);
  });
  it("resolves a valid case with its relation", async () => expect((await getCaseStudyPageContent(caseStudy.slug))?.testimonial?.id).toBe(3));
  it("returns null for an unknown slug", async () => expect(await getCaseStudyPageContent("inexistente")).toBeNull());
  it("does not substitute editorial fallback cases when WordPress fails", async () => { queries.getCaseStudies.mockRejectedValue(new Error("offline")); const content = await getCaseStudiesContent(); expect(content.source).toBe("fallback"); expect(content.cases).toEqual([]); });
  it("produces metadata from the published case", () => expect(caseStudyMetadata(caseStudy)).toMatchObject({ title: "Caso de identidad | 3cuartos", description: "Solución", robots: { index: true } }));
});
