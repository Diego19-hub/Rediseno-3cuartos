export type CollectionParams = {
  page?: number;
  perPage?: number;
  search?: string;
  include?: number[];
  embed?: boolean;
};

const collections = {
  services: "wp/v2/services",
  caseStudies: "wp/v2/case-studies",
  testimonials: "wp/v2/testimonials",
  teamMembers: "wp/v2/team-members",
  resources: "wp/v2/posts",
} as const;

export type CollectionName = keyof typeof collections;

export function collectionEndpoint(name: CollectionName, params: CollectionParams = {}): string {
  const query = new URLSearchParams();
  query.set("page", String(Math.max(1, params.page ?? 1)));
  query.set("per_page", String(Math.min(100, Math.max(1, params.perPage ?? 20))));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.include?.length) query.set("include", params.include.filter(Number.isInteger).join(","));
  if (params.embed) query.set("_embed", "1");
  return `${collections[name]}?${query.toString()}`;
}

export function itemEndpoint(name: CollectionName, slug: string, embed = true): string {
  const query = new URLSearchParams({ slug });
  if (embed) query.set("_embed", "1");
  return `${collections[name]}?${query.toString()}`;
}

export const globalSettingsEndpoint = "3cuartos/v1/settings";
