import type { CaseStudy } from "../../types/wordpress";

export function caseStudyMetadata(caseStudy: CaseStudy) {
  return { title: caseStudy.seo.title || `${caseStudy.title} | 3cuartos`, description: caseStudy.seo.description || caseStudy.solution || caseStudy.challenge, robots: { index: !caseStudy.seo.noindex } };
}
