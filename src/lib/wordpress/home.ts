import { homeProvisional } from "../../content/home.provisional";
import type { CaseStudy, GlobalSettings, Resource, Service, Testimonial } from "../../types/wordpress";
import { getCaseStudies, getGlobalSettings, getResources, getServices, getTestimonials } from "./queries";

export type ContentSource = "wordpress" | "fallback";
export type HomeSectionSources = { services: ContentSource; caseStudies: ContentSource; testimonials: ContentSource; resources: ContentSource; settings: ContentSource };
export type HomeContent = { services: Service[]; caseStudy: CaseStudy; testimonials: Testimonial[]; resources: Resource[]; settings: GlobalSettings; source: ContentSource; sources: HomeSectionSources };

export const getFallbackSettings = (): GlobalSettings => ({ brandName: "3cuartos", contact: homeProvisional.contact, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: homeProvisional.globalCta, defaultSeo: { title: "", description: "", noindex: true } });
export const getFallbackServices = (): Service[] => homeProvisional.services.map((item, index) => ({ id: -(index + 1), slug: ["diseno-branding", "desarrollo-web", "marketing-digital"][index], ...item, description: item.summary, capabilities: [], cta: homeProvisional.globalCta, order: index + 1, seo: { title: "", description: "", noindex: true }, isProvisional: true }));
export const getFallbackTestimonials = (): Testimonial[] => homeProvisional.testimonials.map((quote, index) => ({ id: -(index + 1), quote, personName: `Persona provisional 0${index + 1}`, jobTitle: "Rol provisional", company: "Empresa provisional", order: index + 1, isProvisional: true }));
export const getFallbackResources = (): Resource[] => homeProvisional.resources.map((title, index) => ({ id: -(index + 1), slug: `recurso-provisional-${index + 1}`, title, excerpt: "Contenido demostrativo pendiente de aprobación.", featuredExcerpt: "Contenido demostrativo pendiente de aprobación.", content: "", cta: { label: "Explorar recursos", url: `/recursos/recurso-provisional-${index + 1}` }, readingTime: 0, publishedAt: "", categoryIds: [] }));
export const getFallbackCaseStudy = (services: Service[], testimonials: Testimonial[]): CaseStudy => ({ id: -1, slug: "caso-destacado-provisional", ...homeProvisional.caseStudy, content: "Estrategia provisional pendiente de validación.", metrics: homeProvisional.caseStudy.metrics.map((metric) => ({ ...metric })), objectives: [], serviceIds: services[0] ? [services[0].id] : [], results: [], gallery: [], testimonialId: testimonials[0]?.id, cta: { label: "Ver caso", url: "/casos-de-exito/caso-destacado-provisional" }, seo: { title: "", description: "", noindex: true }, isProvisional: true });

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);
const settled = async <T>(request: Promise<T>, fallback: T): Promise<{ value: T; source: ContentSource }> => { try { return { value: await request, source: "wordpress" }; } catch { return { value: fallback, source: "fallback" }; } };

export async function getHomeContent(): Promise<HomeContent> {
  const [servicesResult, casesResult, testimonialsResult, resourcesResult, settingsResult] = await Promise.all([
    settled(getServices({ perPage: 3 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getCaseStudies({ perPage: 1 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getTestimonials({ perPage: 3 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getResources({ perPage: 6 }), { items: [], page: 1, totalPages: 0, total: 0 }),
    settled(getGlobalSettings(), null),
  ]);
  const services = servicesResult.value.items.length ? byOrder(servicesResult.value.items) : getFallbackServices();
  const testimonials = testimonialsResult.value.items.length ? byOrder(testimonialsResult.value.items) : getFallbackTestimonials();
  const visibleResources = resourcesResult.value.items.filter((item) => item.featuredExcerpt).slice(0, 3);
  const resources = visibleResources.length ? visibleResources : getFallbackResources();
  const caseStudy = casesResult.value.items[0] ?? getFallbackCaseStudy(services, testimonials);
  const settings = settingsResult.value ?? getFallbackSettings();
  const sources: HomeSectionSources = { services: servicesResult.value.items.length ? "wordpress" : "fallback", caseStudies: casesResult.value.items[0] ? "wordpress" : "fallback", testimonials: testimonialsResult.value.items.length ? "wordpress" : "fallback", resources: visibleResources.length ? "wordpress" : "fallback", settings: settingsResult.value ? "wordpress" : "fallback" };
  return { services, caseStudy, testimonials, resources, settings, sources, source: Object.values(sources).every((source) => source === "wordpress") ? "wordpress" : "fallback" };
}
