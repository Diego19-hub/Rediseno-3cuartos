import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import styles from "./layout.module.css";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/casos-de-exito", label: "Casos" },
  { href: "/recursos", label: "Recursos" },
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
] as const;

export function Footer({ tone = "default", compact = false }: { tone?: "default" | "dark"; compact?: boolean }) {
  return (
    <footer className={`${styles.footer} ${tone === "dark" ? styles.footerDark : ""} ${compact ? styles.footerCompact : ""}`}>
      <BrandLogo tone={tone === "dark" ? "light" : "blue"} className={styles.footerLogo} />
      <nav aria-label="Navegación secundaria">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
    </footer>
  );
}
