import type { CaseStudy, GlobalSettings, Service, Testimonial } from "../../types/wordpress";
import { getFallbackSettings, type ContentSource } from "./home";
import { getCaseStudies, getGlobalSettings, getServices, getTestimonialById, getTestimonials } from "./queries";

export type CaseStudiesContent = { cases: CaseStudy[]; services: Service[]; testimonials: Testimonial[]; settings: GlobalSettings; source: ContentSource; sources: { cases: ContentSource; services: ContentSource; testimonials: ContentSource; settings: ContentSource } };
export type CaseStudyPageContent = CaseStudiesContent & { caseStudy: CaseStudy; appliedServices: Service[]; testimonial?: Testimonial; nextCase?: CaseStudy };

export async function getCaseStudiesContent(): Promise<CaseStudiesContent> {
  const [casesResult, servicesResult, testimonialsResult, settingsResult] = await Promise.allSettled([getCaseStudies({ perPage: 100 }), getServices({ perPage: 100 }), getTestimonials({ perPage: 100 }), getGlobalSettings()]);
  const allCases = casesResult.status === "fulfilled" ? casesResult.value.items : [];
  const cases = allCases;
  const services = servicesResult.status === "fulfilled" ? servicesResult.value.items : [];
  const testimonials = testimonialsResult.status === "fulfilled" ? testimonialsResult.value.items : [];
  const settings = settingsResult.status === "fulfilled" && settingsResult.value ? settingsResult.value : getFallbackSettings();
  const sources = {
    cases: casesResult.status === "fulfilled" ? "wordpress" : "fallback",
    services: servicesResult.status === "fulfilled" ? "wordpress" : "fallback",
    testimonials: testimonialsResult.status === "fulfilled" ? "wordpress" : "fallback",
    settings: settingsResult.status === "fulfilled" && settingsResult.value ? "wordpress" : "fallback",
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
  return { ...content, caseStudy, appliedServices: content.services.filter((service) => caseStudy.serviceIds.includes(service.id)), testimonial: testimonial ?? undefined, nextCase: content.cases.length > 1 ? content.cases[(index + 1) % content.cases.length] : undefined };
}
