import { getHomeContent } from "@/lib/wordpress/home";
import { getCaseStudiesContent } from "@/lib/wordpress/case-studies";
import { HomeResponsive } from "@/components/home/home-responsive";

export default async function Home() {
  const [content, caseStudiesContent] = await Promise.all([getHomeContent(), getCaseStudiesContent()]);
  const cta = content.settings.globalCta.label ? content.settings.globalCta : { label: "Cuéntanos tu proyecto", url: "/#contacto" };
  return <HomeResponsive ctaLabel={cta.label} ctaUrl={cta.url} projects={caseStudiesContent.cases} services={caseStudiesContent.services} />;
}
