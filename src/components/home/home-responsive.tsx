"use client";

import { type ComponentType, useEffect, useState } from "react";
import type { SelectedProject } from "@/lib/wordpress/selected-projects";
import { MobileHomeExperience } from "./mobile-home-experience";

type HomeResponsiveProps = {
  ctaLabel: string;
  ctaUrl: string;
  selectedProjects: SelectedProject[];
  previewConfidence: boolean;
};

export function HomeResponsive({ ctaLabel, ctaUrl, selectedProjects, previewConfidence }: HomeResponsiveProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [DesktopHomeExperience, setDesktopHomeExperience] = useState<ComponentType<HomeResponsiveProps> | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    let active = true;
    const update = () => {
      setIsDesktop(query.matches);
      if (!query.matches) {
        setDesktopHomeExperience(null);
        return;
      }
      import("./desktop-home-experience").then((module) => {
        if (active) setDesktopHomeExperience(() => module.DesktopHomeExperience);
      });
    };
    update();
    query.addEventListener("change", update);
    return () => {
      active = false;
      query.removeEventListener("change", update);
    };
  }, []);

  if (isDesktop && DesktopHomeExperience) {
    return <DesktopHomeExperience ctaLabel={ctaLabel} ctaUrl={ctaUrl} selectedProjects={selectedProjects} previewConfidence={previewConfidence} />;
  }

  return <MobileHomeExperience ctaLabel={ctaLabel} ctaUrl={ctaUrl} selectedProjects={selectedProjects} previewConfidence={previewConfidence} />;
}
