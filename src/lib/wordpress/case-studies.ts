import { caseStudiesProvisional } from "../../content/case-studies.provisional";
import type { CaseStudy, GlobalSettings, Service, Testimonial } from "../../types/wordpress";
import { getHomeContent, type HomeContent } from "./home";
import { getCaseStudies, getGlobalSettings, getServices, getTestimonials } from "./queries";

export type CaseStudiesContent = { cases: CaseStudy[]; services: Service[]; testimonials: Testimonial[]; settings: GlobalSettings; source: HomeContent["source"] };
export type CaseStudyPageContent = CaseStudiesContent & { caseStudy: CaseStudy; appliedServices: Service[]; testimonial?: Testimonial; nextCase?: CaseStudy };

const fallback = async (): Promise<CaseStudiesContent> => {
  const home = await getHomeContent();
  const seeds = [
    ["caso-destacado-provisional", "Caso provisional — identidad", 0],
    ["caso-provisional-plataforma", "Caso provisional — plataforma", 1],
    ["caso-provisional-crecimiento", "Caso provisional — crecimiento", 2],
  ] as const;
  return { cases: seeds.map(([slug, title, serviceIndex], index) => ({ id: -(index + 1), slug, title, content: "Estrategia provisional pendiente de validación.", clientName: "Cliente provisional", challenge: "Contexto provisional pendiente de validación.", objectives: ["Objetivo provisional pendiente de validación."], solution: "Solución provisional conectada a estrategia y ejecución.", serviceIds: home.services[serviceIndex] ? [home.services[serviceIndex].id] : [], results: ["Resultado provisional pendiente de validación."], metrics: [{ label: "Métrica provisional", value: "Pendiente", context: "Validar con el cliente" }], gallery: [], testimonialId: home.testimonials[index]?.id, cta: { label: "Ver caso", url: `/casos-de-exito/${slug}` }, seo: { title: "", description: "", noindex: true }, isProvisional: true })), services: home.services, testimonials: home.testimonials, settings: home.settings, source: "fallback" };
};

export async function getCaseStudiesContent(): Promise<CaseStudiesContent> {
  try {
    const [cases, services, testimonials, settings] = await Promise.all([getCaseStudies({ perPage: 20 }), getServices({ perPage: 20 }), getTestimonials({ perPage: 20 }), getGlobalSettings()]);
    if (!cases.items.length || !settings) return fallback();
    return { cases: cases.items, services: services.items, testimonials: testimonials.items, settings, source: "wordpress" };
  } catch {
    return fallback();
  }
}

export async function getCaseStudyPageContent(slug: string): Promise<CaseStudyPageContent | null> {
  const content = await getCaseStudiesContent();
  const index = content.cases.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  const caseStudy = content.cases[index];
  return { ...content, caseStudy, appliedServices: content.services.filter((service) => caseStudy.serviceIds.includes(service.id)), testimonial: content.testimonials.find((item) => item.id === caseStudy.testimonialId), nextCase: content.cases.length > 1 ? content.cases[(index + 1) % content.cases.length] : undefined };
}

export { caseStudiesProvisional };
