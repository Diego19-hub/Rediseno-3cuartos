import type { GlobalSettings, Service, TeamMember, Testimonial } from "../../types/wordpress";
import { getGlobalSettings, getServices, getTeamMembers, getTestimonials } from "./queries";

export type AboutContent = { team: TeamMember[]; services: Service[]; testimonial?: Testimonial; settings: GlobalSettings; source: "wordpress" | "fallback" };

const fallback = (): AboutContent => ({
  team: ["Estrategia y dirección", "Diseño y sistemas", "Tecnología y crecimiento"].map((role, index) => ({ id: -(index + 1), slug: `integrante-provisional-0${index + 1}`, name: `Integrante provisional 0${index + 1}`, biography: "Biografía demostrativa pendiente de aprobación.", role, links: [], order: index + 1, isProvisional: true })),
  services: [], testimonial: undefined,
  settings: { brandName: "3cuartos", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "Cuéntanos tu proyecto", url: "/#contacto" }, defaultSeo: { title: "", description: "", noindex: true } }, source: "fallback",
});

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const [team, services, testimonials, settings] = await Promise.all([getTeamMembers({ perPage: 20 }), getServices({ perPage: 20 }), getTestimonials({ perPage: 1 }), getGlobalSettings()]);
    if (!team.items.length || !settings) return fallback();
    return { team: [...team.items].sort((a, b) => a.order - b.order), services: services.items, testimonial: testimonials.items[0], settings, source: "wordpress" };
  } catch { return fallback(); }
}
