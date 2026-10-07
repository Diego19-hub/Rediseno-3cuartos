import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { getResourcesContent, type ResourceWithCategories } from "@/lib/wordpress/resources";
import { getServicesPageContent } from "@/lib/wordpress/services";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { EditorialScrollScene } from "@/components/motion/editorial-scroll-scene";
import { ResourcesMorphBackdrop } from "@/components/motion/resources-morph-backdrop";
import { ResourcesMotionProvider } from "@/components/motion/resources-motion-context";
import { ResourcesTextHighlight } from "@/components/motion/resources-text-highlight";
import styles from "./resources-hub.module.css";

export const metadata = {
  title: "Recursos | 3cuartos",
  description: "Ideas de estrategia, marca, marketing y tecnología para tomar mejores decisiones digitales.",
};

type ResourcesPageProps = {
  searchParams: Promise<{ tema?: string | string[] }>;
};

type EditorialResource = {
  title: string;
  category: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  date?: string;
  readingTime?: string;
  href: string;
};

const topics = [
  { label: "Estrategia", slug: "estrategia" },
  { label: "Branding", slug: "branding" },
  { label: "Marketing", slug: "marketing" },
  { label: "Desarrollo web", slug: "desarrollo-web" },
  { label: "Tecnología", slug: "tecnologia" },
] as const;

const needs = [
  { lines: ["QUIERO HACER CRECER", "MI NEGOCIO"], highlightLine: 0, highlightBefore: "QUIERO HACER ", highlightText: "CRECER", service: "Marketing", match: ["marketing"] },
  { lines: ["QUIERO CONSTRUIR", "O MEJORAR MI MARCA"], highlightLine: 1, highlightBefore: "O MEJORAR MI ", highlightText: "MARCA", service: "Branding", match: ["branding", "diseño"] },
  { lines: ["NECESITO UNA MEJOR", "PRESENCIA DIGITAL"], highlightLine: 1, highlightBefore: "", highlightText: "PRESENCIA DIGITAL", service: "Desarrollo Web", match: ["desarrollo", "web"] },
] as const;

function formatDate(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function toEditorialResource(resource: ResourceWithCategories): EditorialResource {
  return {
    title: resource.title,
    category: resource.categories[0]?.name ?? "",
    excerpt: resource.featuredExcerpt || resource.excerpt || undefined,
    image: resource.image?.url,
    imageAlt: resource.image?.alt || "",
    date: formatDate(resource.publishedAt),
    readingTime: resource.readingTime > 0 ? `${resource.readingTime} min de lectura` : undefined,
    href: `/recursos/${resource.slug}`,
  };
}

function ResourceImage({ resource, featured = false }: { resource: EditorialResource; featured?: boolean }) {
  if (!resource.image) return null;

  return (
    <div className={featured ? styles.featuredMedia : styles.articleMedia}>
      {/* WordPress media hosts are configurable; preserve the original asset URL without transforming it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resource.image} alt={resource.imageAlt ?? ""} loading={featured ? "eager" : "lazy"} />
    </div>
  );
}

function FeaturedResource({ resource }: { resource: EditorialResource }) {
  return (
    <EditorialScrollScene direction="right" intensity="quiet" className={`${styles.featured} ${resource.image ? "" : styles.featuredNoMedia}`} aria-labelledby="featured-resource-title">
      <p className={styles.sectionLabel}>02 / RECURSO DESTACADO</p>
      <ResourceImage resource={resource} featured />
      <div className={styles.featuredCopy}>
        <div className={styles.meta}>
          {resource.category ? <span>{resource.category}</span> : null}
          {resource.readingTime || resource.date ? <span>{resource.readingTime ?? resource.date}</span> : null}
        </div>
        <h2 id="featured-resource-title"><ResourcesTextHighlight emphasis="light" strength="refined">{resource.title}</ResourcesTextHighlight></h2>
        {resource.excerpt ? <p>{resource.excerpt}</p> : null}
        <Link className={styles.textLink} href={resource.href}>Leer recurso <span aria-hidden="true">→</span></Link>
      </div>
    </EditorialScrollScene>
  );
}

function EditorialGrid({ resources }: { resources: EditorialResource[] }) {
  if (resources.length === 0) return null;

  return (
    <EditorialScrollScene direction="left" intensity="quiet" className={styles.editorialGrid} aria-labelledby="articles-title">
      <div className={styles.gridHeading}>
        <p className={styles.sectionLabel}>04 / LECTURAS</p>
        <h2 id="articles-title">Ideas para volver a mirar.</h2>
      </div>
      <div className={styles.articleList}>
        {resources.map((resource, index) => (
          <article className={`${styles.article} ${styles[`article${(index % 4) + 1}`]}`} key={resource.href}>
            {resource.image ? <Link className={styles.articleImageLink} href={resource.href} aria-label={`Leer ${resource.title}`}><ResourceImage resource={resource} /></Link> : null}
            <div className={styles.articleCopy}>
              <div className={styles.meta}>
                {resource.category ? <span>{resource.category}</span> : null}
                {resource.readingTime || resource.date ? <span>{resource.readingTime ?? resource.date}</span> : null}
              </div>
              <h3><Link href={resource.href}><ResourcesTextHighlight>{resource.title}</ResourcesTextHighlight></Link></h3>
              {resource.excerpt ? <p>{resource.excerpt}</p> : null}
              <Link className={styles.textLink} href={resource.href}>Leer recurso <span aria-hidden="true">→</span></Link>
            </div>
          </article>
        ))}
      </div>
    </EditorialScrollScene>
  );
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const [{ tema }, content, servicesContent] = await Promise.all([searchParams, getResourcesContent(), getServicesPageContent()]);
  const selectedTopic = Array.isArray(tema) ? tema[0] : tema;
  const filtered = selectedTopic
    ? content.resources.filter((resource) => resource.categories.some((category) => category.slug === selectedTopic))
    : content.resources;
  const resources = filtered.map(toEditorialResource);
  const [featured, ...articles] = resources;
  const resolvedNeeds = needs.flatMap((need) => {
    const service = servicesContent.services.find((item) => {
      const name = item.name.toLocaleLowerCase();
      return need.match.some((term) => name.includes(term));
    });
    return service ? [{ ...need, href: `/servicios/${service.slug}` }] : [];
  });

  return <>
    <ResourcesMotionProvider>
    <main className={styles.page}>
      <ResourcesMorphBackdrop />
      <section data-header-theme="light" className={styles.hero} aria-labelledby="resources-title">
        <ScrollReveal>
          <p className={styles.eyebrow}>RECURSOS / 3CUARTOS</p>
          <h1 id="resources-title"><span>Ideas para tomar</span><span><ResourcesTextHighlight phase={[0.36, 0.72]}>mejores</ResourcesTextHighlight> <ResourcesTextHighlight phase={[0.42, 0.78]}>decisiones</ResourcesTextHighlight></span><span><ResourcesTextHighlight phase={[0.48, 0.84]}>digitales.</ResourcesTextHighlight></span></h1>
          <p className={styles.heroText}>Estrategia, marca, <ResourcesTextHighlight phase={[0.3, 0.72]}>marketing</ResourcesTextHighlight> y desarrollo web explicados desde la experiencia.</p>
          <div className={styles.editorialBand} aria-label="Temas de los recursos">
          <span>ESTRATEGIA</span><i>/</i><span>BRANDING</span><i>/</i><span>MARKETING</span><i>/</i><span>DESARROLLO WEB</span>
          </div>
        </ScrollReveal>
      </section>

      {featured ? <FeaturedResource resource={featured} /> : null}
      {selectedTopic && resources.length === 0 ? (
        <section className={styles.topicEmpty} aria-live="polite">
          <p className={styles.sectionLabel}>{topics.find((topic) => topic.slug === selectedTopic)?.label ?? selectedTopic}</p>
          <p>Todavía no hay recursos publicados sobre este tema.</p>
        </section>
      ) : null}

      <EditorialScrollScene direction="right" intensity="medium" data-header-theme="light" className={styles.topics} aria-label="Explorar por tema">
        <ol className={styles.topicList}>
          {topics.map((topic, index) => (
            <li key={topic.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Link href={`/recursos?tema=${topic.slug}`}><ResourcesTextHighlight>{topic.label}</ResourcesTextHighlight></Link>
              <span aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
      </EditorialScrollScene>

      <EditorialGrid resources={articles.slice(0, 4)} />

      <EditorialScrollScene direction="left" intensity="strong" data-header-theme="light" className={styles.needs} aria-labelledby="needs-title">
        <h2 id="needs-title">¿QUÉ ESTÁS INTENTANDO RESOLVER?</h2>
        <nav className={styles.needsList} aria-label="Explorar servicios por necesidad">
          {resolvedNeeds.map((need, index) => (
              <Link href={need.href} key={need.href}>
              <span className={styles.needIndex}>{String(index + 1).padStart(2, "0")}</span>
              <strong>{need.lines.map((line, lineIndex) => lineIndex === need.highlightLine ? <span key={line}>{need.highlightBefore}<ResourcesTextHighlight phase={[0.3 + index * 0.06, 0.7 + index * 0.07]} strength="strong">{need.highlightText}</ResourcesTextHighlight>{line.slice(need.highlightBefore.length + need.highlightText.length)}</span> : <span key={line}>{line}</span>)}</strong>
              <small>→ {need.service}</small>
            </Link>
          ))}
        </nav>
      </EditorialScrollScene>

      <EditorialScrollScene direction="right" intensity="medium" data-header-theme="dark" className={styles.cta} aria-labelledby="resources-cta-title">
  <p className={styles.sectionLabel}>HABLEMOS</p>
        <h2 id="resources-cta-title"><span>Una idea es <ResourcesTextHighlight emphasis="light" strength="refined" phase={[0.36, 0.72]}>más útil</ResourcesTextHighlight></span><span>cuando se <ResourcesTextHighlight emphasis="light" strength="refined" phase={[0.44, 0.8]}>convierte</ResourcesTextHighlight> en <ResourcesTextHighlight emphasis="light" strength="refined" phase={[0.5, 0.86]}>acción.</ResourcesTextHighlight></span></h2>
        <div className={styles.ctaAside}>
          <p>Si encontraste algo que conecta con lo que estás intentando resolver, hablemos.</p>
          <Link className={styles.ctaLink} href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link>
        </div>
      </EditorialScrollScene>
    </main>
    </ResourcesMotionProvider>
    <Footer tone="dark" />
  </>;
}
