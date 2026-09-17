import { resourcesProvisional } from "../../content/resources.provisional";
import type { GlobalSettings, Resource, WordPressCategory } from "../../types/wordpress";
import { getCategories, getGlobalSettings, getResources } from "./queries";

export type ResourceWithCategories = Resource & { categories: WordPressCategory[]; isProvisional: boolean };
export type ResourcesContent = { resources: ResourceWithCategories[]; categories: WordPressCategory[]; settings: GlobalSettings; source: "wordpress" | "fallback" };

const fallback = (): ResourcesContent => {
  const category = { id: -1, name: "Recursos provisionales", slug: "recursos-provisionales" };
  return { resources: resourcesProvisional.items.map((item, index) => ({ id: -(index + 1), ...item, featuredExcerpt: item.excerpt, image: undefined, cta: { label: "Explorar recursos", url: `/recursos/${item.slug}` }, readingTime: 0, publishedAt: "", categoryIds: [category.id], categories: [category], isProvisional: true })), categories: [category], settings: { brandName: "3cuartos", contact: { publicEmail: "", phone: "" }, whatsappUrl: "", bookingUrl: "", socialLinks: [], legalLinks: [], globalCta: { label: "Cuéntanos tu proyecto", url: "/#contacto" }, defaultSeo: { title: "", description: "", noindex: true } }, source: "fallback" };
};

export async function getResourcesContent(): Promise<ResourcesContent> {
  try {
    const [resources, categories, settings] = await Promise.all([getResources({ perPage: 20 }), getCategories(), getGlobalSettings()]);
    if (!settings) return fallback();
    const visible = resources.items.filter((item) => item.featuredExcerpt).map((item) => ({ ...item, categories: categories.filter((category) => item.categoryIds.includes(category.id)), isProvisional: true }));
    return { resources: visible, categories: categories.filter((category) => visible.some((item) => item.categoryIds.includes(category.id))), settings, source: "wordpress" };
  } catch { return fallback(); }
}

export async function getResourcePageContent(slug: string) {
  const content = await getResourcesContent();
  const resource = content.resources.find((item) => item.slug === slug);
  if (!resource) return null;
  return { ...content, resource, related: content.resources.filter((item) => item.id !== resource.id).slice(0, 2) };
}

export { resourcesProvisional };
