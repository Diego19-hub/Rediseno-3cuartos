import type { CaseStudy, GlobalSettings, Resource, Service, Testimonial } from "../../types/wordpress";
import { getCaseStudies, getGlobalSettings, getResources, getServices, getTestimonials } from "./queries";

export type ContentSource = "wordpress" | "fallback";
export type HomeSectionSources = { services: ContentSource; caseStudies: ContentSource; testimonials: ContentSource; resources: ContentSource; settings: ContentSource };
export type HomeContent = { services: Service[]; caseStudy?: CaseStudy; testimonials: Testimonial[]; resources: Resource[]; settings: GlobalSettings; source: ContentSource; sources: HomeSectionSources };

const emptySettings = (): GlobalSettings => ({ brandName: "3cuartos", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "Cuéntanos tu proyecto", url: "/#contacto" }, defaultSeo: { title: "", description: "", noindex: true } });
export const getFallbackSettings = emptySettings;

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);
const settled = async <T>(request: Promise<T>, fallback: T): Promise<{ value: T; source: ContentSource }> => { try { return { value: await request, source: "wordpress" }; } catch { return { value: fallback, source: "fallback" }; } };

export async function getHomeContent(): Promise<HomeContent> {
  const [servicesResult, casesResult, testimonialsResult, resourcesResult, settingsResult] = await Promise.all([
    settled(getServices({ perPage: 20 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getCaseStudies({ perPage: 20 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getTestimonials({ perPage: 20 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getResources({ perPage: 20 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getGlobalSettings(), null),
  ]);
  const services = byOrder(servicesResult.value.items);
  const cases = casesResult.value.items;
  const testimonials = byOrder(testimonialsResult.value.items);
  const resources = resourcesResult.value.items;
  const settings = settingsResult.value ?? emptySettings();
  const sources: HomeSectionSources = {
    services: servicesResult.source,
    caseStudies: casesResult.source,
    testimonials: testimonialsResult.source,
    resources: resourcesResult.source,
    settings: settingsResult.value ? settingsResult.source : "fallback",
  };
  return { services, caseStudy: cases[0], testimonials, resources, settings, sources, source: Object.values(sources).every((source) => source === "wordpress") ? "wordpress" : "fallback" };
}
