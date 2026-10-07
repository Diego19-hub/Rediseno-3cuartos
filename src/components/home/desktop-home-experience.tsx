import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { AgHero } from "@/components/immersive/ag-hero/ag-hero";
import immersiveStyles from "@/components/immersive/immersive-home.module.css";
import { ProblemsSection } from "@/components/sections/problems-section";
import { SystemCore } from "@/components/sections/system-core";
import { SelectedProjectsCarousel } from "@/components/sections/selected-projects";
import { HowWeWork } from "@/components/sections/how-we-work";
import { ConfidenceSection } from "@/components/sections/confidence-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCta } from "@/components/sections/final-cta";
import type { CaseStudy, Service } from "@/types/wordpress";

type DesktopHomeExperienceProps = {
  ctaLabel: string;
  ctaUrl: string;
  projects: CaseStudy[];
  services: Service[];
};

export function DesktopHomeExperience({ ctaLabel, ctaUrl, projects, services }: DesktopHomeExperienceProps) {
  return <>
    <AgHero ctaLabel={ctaLabel} ctaUrl={ctaUrl} />
    <ProblemsSection />
    <section className={immersiveStyles.transition} aria-labelledby="transition-title">
      <div className={immersiveStyles.transitionCopy}>
        <p className={immersiveStyles.eyebrow}>Un sistema, múltiples capacidades.</p>
        <h2 id="transition-title"><span>Tres disciplinas.</span><span>Una misma dirección.</span></h2>
        <p>Conectamos marca, producto y crecimiento para construir experiencias que funcionan como un solo sistema.</p>
        <Link href="/servicios">Explorar nuestros servicios →</Link>
      </div>
      <SystemCore />
    </section>
    <SelectedProjectsCarousel projects={projects} services={services} stackOnScroll />
    <HowWeWork />
    <ConfidenceSection />
    <main>
      <Container><FaqSection /></Container>
      <FinalCta />
    </main>
    <Footer tone="dark" />
  </>;
}
