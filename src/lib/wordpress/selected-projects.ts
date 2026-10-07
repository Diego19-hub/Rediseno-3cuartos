import { wordpressFetch } from "./client";

export type SelectedProject = {
  number: string;
  name: string;
  slug?: string;
  image?: { url: string; alt: string; width?: number; height?: number };
};

type RawCaseStudy = {
  slug?: string;
  title?: { rendered?: string };
  meta?: Record<string, unknown>;
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }> };
};

const plain = (value: unknown) => typeof value === "string" ? value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";

export async function getSelectedProjects(): Promise<SelectedProject[]> {
  try {
    const posts = (await wordpressFetch<RawCaseStudy[]>("wp/v2/case-studies?per_page=100&_embed=1")).data;
    return posts
      .map((post, index) => {
        const media = post._embedded?.["wp:featuredmedia"]?.[0];
        const name = plain(post.meta?.["3cuartos_client_name"]) || plain(post.title?.rendered);
        return { number: `${String(index + 1).padStart(2, "0")} / ${String(posts.length).padStart(2, "0")}`, name, slug: post.slug, image: media?.source_url ? { url: media.source_url, alt: media.alt_text || name, width: media.media_details?.width, height: media.media_details?.height } : undefined };
      }).filter((project) => project.name.trim());
  } catch {
    return [];
  }
}
