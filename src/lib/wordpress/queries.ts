import type { CaseStudy, GlobalSettings, LegalPage, Resource, Service, TeamMember, Testimonial, WordPressCategory } from "../../types/wordpress";
import { wordpressFetch } from "./client";
import { collectionEndpoint, globalSettingsEndpoint, type CollectionName, type CollectionParams } from "./endpoints";
import { caseStudy, globalSettings, resource, service, teamMember, testimonial } from "./normalizers";
import { WordPressApiError } from "./errors";

export type PageResult<T> = { items: T[]; page: number; totalPages: number; total: number };
type Normalizer<T> = (value: never) => T;
const normalizers: Record<CollectionName, Normalizer<Service | CaseStudy | Testimonial | TeamMember | Resource>> = { services: service as Normalizer<Service>, caseStudies: caseStudy as Normalizer<CaseStudy>, testimonials: testimonial as Normalizer<Testimonial>, teamMembers: teamMember as Normalizer<TeamMember>, resources: resource as Normalizer<Resource> };

export async function getCollection<T>(name: CollectionName, params: CollectionParams = {}): Promise<PageResult<T>> {
  try {
    const { data, response } = await wordpressFetch<never[]>(collectionEndpoint(name, { ...params, embed: true }));
    return { items: data.map(normalizers[name]) as T[], page: params.page ?? 1, total: Number(response.headers.get("X-WP-Total") ?? 0), totalPages: Number(response.headers.get("X-WP-TotalPages") ?? 0) };
  } catch (error) {
    if (error instanceof WordPressApiError && error.status === 404) return { items: [], page: params.page ?? 1, total: 0, totalPages: 0 };
    throw error;
  }
}

export const getServices = (params?: CollectionParams) => getCollection<Service>("services", params);
export const getCaseStudies = (params?: CollectionParams) => getCollection<CaseStudy>("caseStudies", params);
export const getTestimonials = (params?: CollectionParams) => getCollection<Testimonial>("testimonials", params);
export const getTeamMembers = (params?: CollectionParams) => getCollection<TeamMember>("teamMembers", params);
export const getResources = (params?: CollectionParams) => getCollection<Resource>("resources", params);

export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const { data } = await wordpressFetch<Array<{ id?: number; name?: string; slug?: string }>>("wp/v2/categories?per_page=100");
    return data.filter((item): item is { id: number; name: string; slug: string } => Number.isInteger(item.id) && typeof item.name === "string" && typeof item.slug === "string").map((item) => ({ id: item.id, name: item.name, slug: item.slug }));
  } catch (error) { if (error instanceof WordPressApiError && error.status === 404) return []; throw error; }
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try { return globalSettings((await wordpressFetch<unknown>(globalSettingsEndpoint)).data); }
  catch (error) { if (error instanceof WordPressApiError && error.status === 404) return null; throw error; }
}
export async function getPageBySlug(slug: string): Promise<LegalPage | null> {
  try {
    const { data } = await wordpressFetch<Array<{ slug?: string; title?: { rendered?: string }; content?: { rendered?: string }; excerpt?: { rendered?: string }; modified?: string }>>(
      `wp/v2/pages?slug=${encodeURIComponent(slug)}&per_page=1`,
    );
    const page = data[0];
    if (!page?.slug) return null;
    const plain = (value?: string) => (value ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    return { slug: page.slug, title: plain(page.title?.rendered) || "Página legal", content: plain(page.content?.rendered), excerpt: plain(page.excerpt?.rendered), modifiedAt: page.modified ?? "", isProvisional: true };
  } catch { return null; }
}
