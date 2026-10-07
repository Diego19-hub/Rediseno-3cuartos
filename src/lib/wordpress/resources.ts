import type { GlobalSettings, Resource, WordPressCategory } from "../../types/wordpress";
import { getFallbackSettings } from "./home";
import { getCategories, getGlobalSettings, getResources } from "./queries";

export type ResourceWithCategories = Resource & { categories: WordPressCategory[] };
export type ResourcesContent = { resources: ResourceWithCategories[]; categories: WordPressCategory[]; settings: GlobalSettings; source: "wordpress" | "fallback" };

export async function getResourcesContent(): Promise<ResourcesContent> {
  try {
    const [resources, categories, cmsSettings] = await Promise.all([getResources({ perPage: 100 }), getCategories(), getGlobalSettings()]);
    const settings = cmsSettings ?? getFallbackSettings();
    const visible = resources.items
      .filter((item) => {
        const title = item.title.trim().toLocaleLowerCase();
        const content = item.content.trim().toLocaleLowerCase();
        const defaultTitle = title === "¡hola mundo!" || title === "hola mundo" || title === "hello world!" || title === "hello world";
        const defaultFirstPost = content.startsWith("bienvenido a wordpress. esta es tu primera entrada.")
          || content.startsWith("welcome to wordpress. this is your first post.");
        return !(item.slug === "hello-world" && defaultTitle) && !(defaultTitle && defaultFirstPost);
      })
      .map((item) => ({ ...item, categories: categories.filter((category) => item.categoryIds.includes(category.id)) }));
    return { resources: visible, categories: categories.filter((category) => visible.some((item) => item.categoryIds.includes(category.id))), settings, source: "wordpress" };
  } catch {
    return { resources: [], categories: [], settings: getFallbackSettings(), source: "fallback" };
  }
}

export async function getResourcePageContent(slug: string) {
  const content = await getResourcesContent();
  const resource = content.resources.find((item) => item.slug === slug);
  if (!resource) return null;
  return { ...content, resource, related: content.resources.filter((item) => item.id !== resource.id).slice(0, 2) };
}
