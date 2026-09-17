import type { Service } from "../../types/wordpress";

export function serviceMetadata(service: Service) {
  return {
    title: service.seo.title || `${service.name} | 3cuartos`,
    description: service.seo.description || service.summary,
    robots: { index: !service.seo.noindex },
  };
}
