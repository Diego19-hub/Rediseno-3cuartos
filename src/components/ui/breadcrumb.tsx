import Link from "next/link";

export function Breadcrumb({ current }: { current: string }) {
  return <nav aria-label="Migas de pan"><ol><li><Link href="/">Inicio</Link></li><li><Link href="/servicios">Servicios</Link></li><li aria-current="page">{current}</li></ol></nav>;
}
