"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";
import { BrandLogo } from "@/components/ui/brand-logo";
import styles from "./layout.module.css";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Casos de éxito", href: "/casos-de-exito" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Recursos", href: "/recursos" },
  { label: "Contacto", href: "/contacto" },
] as const;

function isActive(currentPath: string | undefined, href: string) {
  return currentPath === href || (href !== "/" && Boolean(currentPath?.startsWith(`${href}/`)));
}

function routeStartsDark(currentPath?: string) {
  return currentPath === "/" || currentPath === "/servicios" || currentPath === "/nosotros";
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [dark, setDark] = useState(() => routeStartsDark(pathname));

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-global-header]");
    if (!header) return;
    let frame = 0;
    const syncHeaderOffset = () => document.documentElement.style.setProperty("--header-offset", `${header.offsetHeight}px`);
    const updateTheme = () => {
      frame = 0;
      syncHeaderOffset();
      const boundary = header.getBoundingClientRect().bottom + 1;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]"));
      const active = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= boundary && bounds.bottom > boundary;
      });
      setDark(active ? active.dataset.headerTheme === "dark" : routeStartsDark(pathname));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(updateTheme); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); observer.disconnect(); if (frame) window.cancelAnimationFrame(frame); };
  }, [pathname]);

  return <header data-global-header className={`${styles.header} ${dark ? styles.headerDark : styles.headerLight} ${pathname === "/" ? styles.headerHome : ""}`}>
    <Link aria-current={isActive(pathname, "/") ? "page" : undefined} aria-label="3cuartos, inicio" className={styles.brand} href="/"><BrandLogo tone={dark ? "light" : "blue"} /></Link>
    <nav aria-label="Navegación principal" className={styles.desktop}>
      {links.map((link) => <Link aria-current={isActive(pathname, link.href) ? "page" : undefined} href={link.href} key={link.href}>{link.label}</Link>)}
    </nav>
    <Link className={styles.cta} href="/contacto">Cuéntanos tu proyecto</Link>
    <MobileMenu key={pathname} currentPath={pathname} />
  </header>;
}
