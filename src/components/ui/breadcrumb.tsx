import Link from "next/link";

export function Breadcrumb({ current, sectionLabel = "Servicios", sectionHref = "/servicios" }: { current: string; sectionLabel?: string; sectionHref?: string }) {
  return <nav aria-label="Migas de pan"><ol><li><Link href="/">Inicio</Link></li><li><Link href={sectionHref}>{sectionLabel}</Link></li><li aria-current="page">{current}</li></ol></nav>;
}
