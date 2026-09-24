import { homeProvisional as home } from "@/content/home.provisional";
import { getHomeContent } from "@/lib/wordpress/home";
import { getSelectedProjects } from "@/lib/wordpress/selected-projects";
import { HomeResponsive } from "@/components/home/home-responsive";

export default async function Home() {
  const content = await getHomeContent();
  const selectedProjects = await getSelectedProjects();
  const cta = content.settings.globalCta.label ? content.settings.globalCta : home.globalCta;
  return <HomeResponsive ctaLabel={cta.label} ctaUrl={cta.url} selectedProjects={selectedProjects} previewConfidence={process.env.NODE_ENV === "development"} />;
}
