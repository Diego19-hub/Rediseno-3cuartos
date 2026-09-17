import type { CaseStudy, Service, Testimonial } from "../../types/wordpress";
import { getHomeContent, type HomeContent } from "./home";

export type ServicePageContent = {
  service: Service;
  caseStudy?: CaseStudy;
  testimonial?: Testimonial;
  relatedServices: Service[];
  source: HomeContent["source"];
};

export async function getServicesPageContent(): Promise<HomeContent> {
  return getHomeContent();
}

export async function getServicePageContent(slug: string): Promise<ServicePageContent | null> {
  const content = await getHomeContent();
  const service = content.services.find((item) => item.slug === slug);
  if (!service) return null;
  const caseStudy = content.caseStudy.serviceIds.includes(service.id) || content.source === "fallback" ? content.caseStudy : undefined;
  const testimonial = caseStudy?.testimonialId ? content.testimonials.find((item) => item.id === caseStudy.testimonialId) : content.testimonials[0];
  return { service, caseStudy, testimonial, relatedServices: content.services.filter((item) => item.id !== service.id), source: content.source };
}
