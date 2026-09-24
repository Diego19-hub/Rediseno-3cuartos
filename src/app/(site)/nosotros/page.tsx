import { getAboutContent } from "@/lib/wordpress/about";
import { AboutPageResponsive } from "./about-page-responsive";

export const metadata = {
  title: "Nosotros | 3cuartos",
  description: "Quiénes somos y cómo trabaja 3Cuartos para conectar estrategia, creatividad y tecnología.",
};

export default async function AboutPage() {
  const content = await getAboutContent();
  const cta = content.settings.globalCta.label
    ? content.settings.globalCta
    : { label: "Cuéntanos tu proyecto", url: "/contacto" };

  return <AboutPageResponsive team={content.team} services={content.services} testimonial={content.testimonial} ctaLabel={cta.label} ctaUrl={cta.url} />;
}
