import type { CaseStudy, GlobalSettings, Service, Testimonial } from "../../types/wordpress";
import { getFallbackSettings, type ContentSource } from "./home";
import { getCaseStudies, getGlobalSettings, getServices, getTestimonials } from "./queries";

export type ServicesPageContent = { services: Service[]; settings: GlobalSettings; source: ContentSource };
export type ServicePageContent = { service: Service; caseStudy?: CaseStudy; testimonial?: Testimonial; relatedServices: Service[]; source: ContentSource };

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  const [servicesResult, settingsResult] = await Promise.allSettled([getServices({ perPage: 100 }), getGlobalSettings()]);
  const services = servicesResult.status === "fulfilled" ? servicesResult.value.items : [];
  const settings = settingsResult.status === "fulfilled" && settingsResult.value ? settingsResult.value : getFallbackSettings();
  return { services: [...services].sort((a, b) => a.order - b.order), settings, source: servicesResult.status === "fulfilled" ? "wordpress" : "fallback" };
}

export async function getServicePageContent(slug: string): Promise<ServicePageContent | null> {
  const content = await getServicesPageContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) return null;
  const [casesResult, testimonialsResult] = await Promise.allSettled([getCaseStudies({ perPage: 100 }), getTestimonials({ perPage: 100 })]);
  const cases = casesResult.status === "fulfilled" ? casesResult.value.items : [];
  const testimonials = testimonialsResult.status === "fulfilled" ? testimonialsResult.value.items : [];
  const linkedCases = cases.filter((item) => item.serviceIds.includes(service.id));
  // Marketing Digital has a specific Natuo case in WordPress; prefer that
  // linked entry over older/demo case studies returned earlier by the API.
  const caseStudy = slug === "marketing-digital"
    ? linkedCases.find((item) => item.slug === "natuo") ?? linkedCases[0]
    : linkedCases[0];
  const testimonial = caseStudy?.testimonialId ? testimonials.find((item) => item.id === caseStudy.testimonialId && (!item.caseStudyId || item.caseStudyId === caseStudy.id)) : undefined;
  return { service, caseStudy, testimonial, relatedServices: content.services.filter((item) => item.id !== service.id), source: content.source };
}
