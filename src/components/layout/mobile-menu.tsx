"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
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

export function MobileMenu({ currentPath }: { currentPath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const close = (restore = false) => { setIsOpen(false); if (restore) requestAnimationFrame(() => triggerRef.current?.focus()); };
  useEffect(() => {
    if (isOpen) firstLink.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { close(true); return; }
      if (event.key !== "Tab" || !isOpen) return;
      const focusable = Array.from(overlayRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []);
      if (!focusable.length) return;
      const currentIndex = focusable.indexOf(document.activeElement as HTMLAnchorElement);
      const nextIndex = event.shiftKey ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1) : (currentIndex === focusable.length - 1 ? 0 : currentIndex + 1);
      event.preventDefault();
      focusable[nextIndex]?.focus();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [isOpen]);
  useEffect(() => { document.body.style.overflow = isOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [isOpen]);
  return <div className={styles.mobile}>
    <button ref={triggerRef} type="button" aria-expanded={isOpen} aria-controls={menuId} aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} className={styles.menuButton} onClick={() => setIsOpen((current) => !current)}>{isOpen ? "Cerrar" : "Menú"}</button>
    {isOpen && <div ref={overlayRef} id={menuId} className={styles.menuOverlay} role="dialog" aria-modal="true" aria-label="Navegación del sitio"><nav>{links.map((link, index) => <Link ref={index === 0 ? firstLink : undefined} aria-current={isActive(currentPath, link.href) ? "page" : undefined} href={link.href} onClick={() => close()} key={link.href}><span>0{index + 1}</span>{link.label}</Link>)}</nav></div>}
  </div>;
}
