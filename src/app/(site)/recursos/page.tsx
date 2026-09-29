import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { getResourcesContent, type ResourceWithCategories } from "@/lib/wordpress/resources";
import { getServicesPageContent } from "@/lib/wordpress/services";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { EditorialScrollScene } from "@/components/motion/editorial-scroll-scene";
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
  { lines: ["QUIERO HACER CRECER", "MI NEGOCIO"], service: "Marketing", match: ["marketing"] },
  { lines: ["QUIERO CONSTRUIR", "O MEJORAR MI MARCA"], service: "Branding", match: ["branding", "diseño"] },
  { lines: ["NECESITO UNA MEJOR", "PRESENCIA DIGITAL"], service: "Desarrollo Web", match: ["desarrollo", "web"] },
] as const;

const invalidContentPattern = /provisional|demo|pendiente|contenido de respaldo/i;

function isPublishableResource(resource: ResourceWithCategories, source: "wordpress" | "fallback") {
  return source === "wordpress"
    && resource.id > 0
    && Boolean(resource.slug && resource.title && (resource.featuredExcerpt || resource.excerpt))
    && !invalidContentPattern.test(`${resource.title} ${resource.featuredExcerpt} ${resource.excerpt}`);
}

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
    <EditorialScrollScene direction="right" intensity="medium" className={`${styles.featured} ${resource.image ? "" : styles.featuredNoMedia}`} aria-labelledby="featured-resource-title">
      <p className={styles.sectionLabel}>02 / RECURSO DESTACADO</p>
      <ResourceImage resource={resource} featured />
      <div className={styles.featuredCopy}>
        <div className={styles.meta}>
          {resource.category ? <span>{resource.category}</span> : null}
          {resource.readingTime || resource.date ? <span>{resource.readingTime ?? resource.date}</span> : null}
        </div>
        <h2 id="featured-resource-title">{resource.title}</h2>
        {resource.excerpt ? <p>{resource.excerpt}</p> : null}
        <Link className={styles.textLink} href={resource.href}>Leer recurso <span aria-hidden="true">→</span></Link>
      </div>
    </EditorialScrollScene>
  );
}

function EditorialGrid({ resources }: { resources: EditorialResource[] }) {
  if (resources.length === 0) return null;

  return (
    <EditorialScrollScene direction="left" className={styles.editorialGrid} aria-labelledby="articles-title">
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
              <h3><Link href={resource.href}>{resource.title}</Link></h3>
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
  const publishable = content.resources.filter((resource) => isPublishableResource(resource, content.source));
  const filtered = selectedTopic
    ? publishable.filter((resource) => resource.categories.some((category) => category.slug === selectedTopic))
    : publishable;
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
    <main className={styles.page}>
      <section data-header-theme="light" className={styles.hero} aria-labelledby="resources-title">
        <ScrollReveal>
          <p className={styles.eyebrow}>RECURSOS / 3CUARTOS</p>
          <h1 id="resources-title"><span>Ideas para tomar</span><span>mejores decisiones</span><span>digitales.</span></h1>
          <p className={styles.heroText}>Estrategia, marca, marketing y desarrollo web<br />explicados desde la experiencia.</p>
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
          <p>Próximamente compartiremos nuevas ideas de 3Cuartos.</p>
        </section>
      ) : null}

      <EditorialScrollScene direction="right" intensity="medium" data-header-theme="light" className={styles.topics} aria-labelledby="topics-title">
        <h2 id="topics-title">03 / EXPLORAR POR TEMA</h2>
        <ol className={styles.topicList}>
          {topics.map((topic, index) => (
            <li key={topic.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <Link href={`/recursos?tema=${topic.slug}`}>{topic.label}</Link>
              <span aria-hidden="true">↗</span>
            </li>
          ))}
        </ol>
      </EditorialScrollScene>

      <EditorialGrid resources={articles.slice(0, 4)} />

      <EditorialScrollScene direction="left" intensity="medium" data-header-theme="light" className={styles.needs} aria-labelledby="needs-title">
        <p className={styles.sectionLabel}>05 / ENTRADA POR PROBLEMA</p>
        <h2 id="needs-title">¿QUÉ ESTÁS INTENTANDO RESOLVER?</h2>
        <nav className={styles.needsList} aria-label="Explorar servicios por necesidad">
          {resolvedNeeds.map((need, index) => (
            <Link href={need.href} key={need.href}>
              <span className={styles.needIndex}>{String(index + 1).padStart(2, "0")}</span>
              <strong><span>{need.lines[0]}</span><span>{need.lines[1]}</span></strong>
              <small>→ {need.service}</small>
            </Link>
          ))}
        </nav>
      </EditorialScrollScene>

      <EditorialScrollScene direction="right" data-header-theme="dark" className={styles.cta} aria-labelledby="resources-cta-title">
        <p className={styles.sectionLabel}>06 / HABLEMOS</p>
        <h2 id="resources-cta-title"><span>Una idea es más útil</span><span>cuando se convierte en acción.</span></h2>
        <div className={styles.ctaAside}>
          <p>Si encontraste algo que conecta con lo que estás intentando resolver, hablemos.</p>
          <Link className={styles.ctaLink} href="/contacto">Cuéntanos tu proyecto <span aria-hidden="true">→</span></Link>
        </div>
      </EditorialScrollScene>
    </main>
    <Footer tone="dark" />
  </>;
}
