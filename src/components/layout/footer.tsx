import Link from "next/link";
import styles from "./layout.module.css";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/casos-de-exito", label: "Casos" },
  { href: "/recursos", label: "Recursos" },
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
] as const;

export function Footer({ tone = "default" }: { tone?: "default" | "dark" }) {
  return (
    <footer className={`${styles.footer} ${tone === "dark" ? styles.footerDark : ""}`}>
      <strong>3cuartos</strong>
      <nav aria-label="Navegación secundaria">
        {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
    </footer>
  );
}
