import { wordpressFetch } from "./client";

export type SelectedProject = {
  number: string;
  name: string;
  slug?: string;
  image?: { url: string; alt: string; width?: number; height?: number };
};

const names = ["Calforce", "AnswareIT", "Natuo", "Senderos del Roble"] as const;
const localFallback: Record<string, SelectedProject["image"]> = {
  Calforce: { url: "/images/projects/Calforce.png", alt: "Calforce" },
  AnswareIT: { url: "/images/projects/AnswareIT.png", alt: "AnswareIT" },
  Natuo: { url: "/images/projects/natuo-provisional.png", alt: "Natuo" },
  "Senderos del Roble": { url: "/images/projects/SenderosDelRoble.png", alt: "Senderos del Roble" },
};

type RawCaseStudy = {
  slug?: string;
  title?: { rendered?: string };
  meta?: Record<string, unknown>;
  _embedded?: { "wp:featuredmedia"?: Array<{ source_url?: string; alt_text?: string; media_details?: { width?: number; height?: number } }> };
};

const plain = (value: unknown) => typeof value === "string" ? value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";

export async function getSelectedProjects(): Promise<SelectedProject[]> {
  let posts: RawCaseStudy[] = [];
  try {
    posts = (await wordpressFetch<RawCaseStudy[]>("wp/v2/case-studies?per_page=100&_embed=1")).data;
  } catch {
    // The local fallback still renders the approved names when WordPress is unavailable.
  }

  return names.map((name, index) => {
    const post = posts.find((item) => plain(item.meta?.["3cuartos_client_name"]) === name || plain(item.title?.rendered) === name);
    const media = post?._embedded?.["wp:featuredmedia"]?.[0];
    return {
      number: `${String(index + 1).padStart(2, "0")} / 04`,
      name,
      slug: post?.slug,
      image: media?.source_url ? { url: media.source_url, alt: media.alt_text || name, width: media.media_details?.width, height: media.media_details?.height } : localFallback[name],
    };
  });
}
