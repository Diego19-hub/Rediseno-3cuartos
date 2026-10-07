import type { GlobalSettings, Service, TeamMember, Testimonial } from "../../types/wordpress";
import { getFallbackSettings, type ContentSource } from "./home";
import { getGlobalSettings, getServices, getTeamMembers, getTestimonials } from "./queries";

export type AboutContent = { team: TeamMember[]; services: Service[]; testimonial?: Testimonial; settings: GlobalSettings; source: ContentSource };

export async function getAboutContent(): Promise<AboutContent> {
  const [teamResult, servicesResult, testimonialsResult, settingsResult] = await Promise.allSettled([
    getTeamMembers({ perPage: 100 }),
    getServices({ perPage: 100 }),
    getTestimonials({ perPage: 100 }),
    getGlobalSettings(),
  ]);
  const team = teamResult.status === "fulfilled" ? [...teamResult.value.items].sort((a, b) => a.order - b.order) : [];
  const services = servicesResult.status === "fulfilled" ? servicesResult.value.items : [];
  const testimonials = testimonialsResult.status === "fulfilled" ? [...testimonialsResult.value.items].sort((a, b) => a.order - b.order) : [];
  const settings = settingsResult.status === "fulfilled" && settingsResult.value ? settingsResult.value : getFallbackSettings();
  return { team, services, testimonial: testimonials[0], settings, source: teamResult.status === "fulfilled" && settingsResult.status === "fulfilled" && Boolean(settingsResult.value) ? "wordpress" : "fallback" };
}
