import { homeProvisional } from "../../content/home.provisional";
import type { CaseStudy, GlobalSettings, Resource, Service, Testimonial } from "../../types/wordpress";
import { getCaseStudies, getGlobalSettings, getResources, getServices, getTestimonials } from "./queries";

export type HomeContent = {
  services: Service[];
  caseStudy: CaseStudy;
  testimonials: Testimonial[];
  resources: Resource[];
  settings: GlobalSettings;
  source: "wordpress" | "fallback";
};

const fallback = (): HomeContent => ({
  services: homeProvisional.services.map((item, index) => ({ id: -(index + 1), slug: `provisional-service-${index + 1}`, ...item, description: item.summary, capabilities: [], cta: homeProvisional.globalCta, order: index + 1, seo: { title: "", description: "", noindex: true }, isProvisional: true })),
  caseStudy: { id: -1, slug: "caso-destacado-provisional", ...homeProvisional.caseStudy, metrics: homeProvisional.caseStudy.metrics.map((metric) => ({ ...metric })), serviceIds: [], results: [], gallery: [], cta: { label: "Ver caso", url: "#casos" }, seo: { title: "", description: "", noindex: true }, isProvisional: true },
  testimonials: homeProvisional.testimonials.map((quote, index) => ({ id: -(index + 1), quote, personName: `Persona provisional 0${index + 1}`, jobTitle: "Rol provisional", company: "Empresa provisional", order: index + 1, isProvisional: true })),
  resources: homeProvisional.resources.map((title, index) => ({ id: -(index + 1), slug: `recurso-provisional-${index + 1}`, title, excerpt: "Contenido demostrativo pendiente de aprobación.", featuredExcerpt: "Contenido demostrativo pendiente de aprobación.", content: "", cta: { label: "Explorar recursos", url: "#recursos" }, readingTime: 0, publishedAt: "" })),
  settings: { brandName: "3cuartos", contact: homeProvisional.contact, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: homeProvisional.globalCta, defaultSeo: { title: "", description: "", noindex: true } },
  source: "fallback",
});

const byOrder = <T extends { order: number }>(items: T[]) => [...items].sort((a, b) => a.order - b.order);

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const [services, cases, testimonials, resources, settings] = await Promise.all([getServices({ perPage: 3 }), getCaseStudies({ perPage: 1 }), getTestimonials({ perPage: 3 }), getResources({ perPage: 6 }), getGlobalSettings()]);
    const visibleResources = resources.items.filter((item) => item.featuredExcerpt).slice(0, 3);
    if (!services.items.length || !cases.items[0] || !testimonials.items.length || !visibleResources.length || !settings) return fallback();
    return { services: byOrder(services.items), caseStudy: cases.items[0], testimonials: byOrder(testimonials.items), resources: visibleResources, settings, source: "wordpress" };
  } catch {
    return fallback();
  }
}
