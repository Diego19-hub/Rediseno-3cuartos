import { caseStudiesProvisional } from "../../content/case-studies.provisional";
import type { CaseStudy, GlobalSettings, Service, Testimonial } from "../../types/wordpress";
import { getFallbackServices, getFallbackSettings, getFallbackTestimonials, type ContentSource } from "./home";
import { getCaseStudies, getGlobalSettings, getServices, getTestimonialById, getTestimonials } from "./queries";

export type CaseStudiesContent = { cases: CaseStudy[]; services: Service[]; testimonials: Testimonial[]; settings: GlobalSettings; source: ContentSource; sources: { cases: ContentSource; services: ContentSource; testimonials: ContentSource; settings: ContentSource } };
export type CaseStudyPageContent = CaseStudiesContent & { caseStudy: CaseStudy; appliedServices: Service[]; testimonial?: Testimonial; nextCase?: CaseStudy };

const fallbackCases = (services: Service[], testimonials: Testimonial[]): CaseStudy[] => {
  const seeds = [
    ["caso-destacado-provisional", "Caso provisional — identidad", 0],
    ["caso-provisional-plataforma", "Caso provisional — plataforma", 1],
    ["caso-provisional-crecimiento", "Caso provisional — crecimiento", 2],
  ] as const;
  return seeds.map(([slug, title, serviceIndex], index) => ({ id: -(index + 1), slug, title, content: "Estrategia provisional pendiente de validación.", clientName: "Cliente provisional", challenge: "Contexto provisional pendiente de validación.", objectives: ["Objetivo provisional pendiente de validación."], solution: "Solución provisional conectada a estrategia y ejecución.", serviceIds: services[serviceIndex] ? [services[serviceIndex].id] : [], results: ["Resultado provisional pendiente de validación."], metrics: [{ label: "Métrica provisional", value: "Pendiente", context: "Validar con el cliente" }], gallery: [], testimonialId: testimonials[index]?.id, cta: { label: "Ver caso", url: `/casos-de-exito/${slug}` }, seo: { title: "", description: "", noindex: true }, isProvisional: true }));
};

export async function getCaseStudiesContent(): Promise<CaseStudiesContent> {
  const [casesResult, servicesResult, testimonialsResult, settingsResult] = await Promise.allSettled([getCaseStudies({ perPage: 20 }), getServices({ perPage: 20 }), getTestimonials({ perPage: 20 }), getGlobalSettings()]);
  const services = servicesResult.status === "fulfilled" && servicesResult.value.items.length ? servicesResult.value.items : getFallbackServices();
  const testimonials = testimonialsResult.status === "fulfilled" && testimonialsResult.value.items.length ? testimonialsResult.value.items : getFallbackTestimonials();
  const cases = casesResult.status === "fulfilled" && casesResult.value.items.length ? casesResult.value.items : fallbackCases(services, testimonials);
  const settings = settingsResult.status === "fulfilled" && settingsResult.value ? settingsResult.value : getFallbackSettings();
  const sources = {
    cases: casesResult.status === "fulfilled" && casesResult.value.items.length ? "wordpress" : "fallback",
    services: servicesResult.status === "fulfilled" && servicesResult.value.items.length ? "wordpress" : "fallback",
    testimonials: testimonialsResult.status === "fulfilled" && testimonialsResult.value.items.length ? "wordpress" : "fallback",
    settings: settingsResult.status === "fulfilled" && Boolean(settingsResult.value) ? "wordpress" : "fallback",
  } satisfies CaseStudiesContent["sources"];
  return { cases, services, testimonials, settings, sources, source: Object.values(sources).every((source) => source === "wordpress") ? "wordpress" : "fallback" };
}

export async function getCaseStudyPageContent(slug: string): Promise<CaseStudyPageContent | null> {
  const content = await getCaseStudiesContent();
  const index = content.cases.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  const caseStudy = content.cases[index];
  const testimonial = caseStudy.testimonialId
    ? await getTestimonialById(caseStudy.testimonialId) ?? content.testimonials.find((item) => item.id === caseStudy.testimonialId)
    : undefined;
  return { ...content, caseStudy, appliedServices: content.services.filter((service) => caseStudy.serviceIds.includes(service.id)), testimonial, nextCase: content.cases.length > 1 ? content.cases[(index + 1) % content.cases.length] : undefined };
}

export { caseStudiesProvisional };
