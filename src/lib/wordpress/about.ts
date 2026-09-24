import type { GlobalSettings, Service, TeamMember, Testimonial } from "../../types/wordpress";
import { getGlobalSettings, getServices, getTeamMembers, getTestimonials } from "./queries";

export type AboutContent = { team: TeamMember[]; services: Service[]; testimonial?: Testimonial; settings: GlobalSettings; source: "wordpress" | "fallback" };

const fallback = (): AboutContent => ({
  team: ["Estrategia y dirección", "Diseño y sistemas", "Tecnología y crecimiento"].map((role, index) => ({ id: -(index + 1), slug: `integrante-provisional-0${index + 1}`, name: `Integrante provisional 0${index + 1}`, biography: "Biografía demostrativa pendiente de aprobación.", role, links: [], order: index + 1, isProvisional: true })),
  services: [], testimonial: undefined,
  settings: { brandName: "3cuartos", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "Cuéntanos tu proyecto", url: "/#contacto" }, defaultSeo: { title: "", description: "", noindex: true } }, source: "fallback",
});

export async function getAboutContent(): Promise<AboutContent> {
  const [teamResult, servicesResult, testimonialsResult, settingsResult] = await Promise.allSettled([
    getTeamMembers({ perPage: 20 }),
    getServices({ perPage: 20 }),
    getTestimonials({ perPage: 20 }),
    getGlobalSettings(),
  ]);
  const fallbackContent = fallback();
  const team = teamResult.status === "fulfilled" && teamResult.value.items.length
    ? [...teamResult.value.items].sort((a, b) => a.order - b.order)
    : fallbackContent.team;
  const services = servicesResult.status === "fulfilled" ? servicesResult.value.items : fallbackContent.services;
  const testimonials = testimonialsResult.status === "fulfilled" ? [...testimonialsResult.value.items].sort((a, b) => a.order - b.order) : [];
  const settings = settingsResult.status === "fulfilled" && settingsResult.value ? settingsResult.value : fallbackContent.settings;
  return { team, services, testimonial: testimonials[0], settings, source: teamResult.status === "fulfilled" && settingsResult.status === "fulfilled" && Boolean(settingsResult.value) ? "wordpress" : "fallback" };
}
