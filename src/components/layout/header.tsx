import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import styles from "./layout.module.css";
export function Header() { return <header className={styles.header}><Link aria-current="page" aria-label="3cuartos, inicio" className={styles.brand} href="/">3cuartos</Link><nav aria-label="Navegación principal" className={styles.desktop}><Link href="/">Inicio</Link><a href="#servicios">Servicios</a><a href="#casos">Casos de éxito</a><a href="#proceso">Proceso</a><Link href="/nosotros">Nosotros</Link><a href="#recursos">Recursos</a><a href="#contacto">Contacto</a></nav><a className={styles.cta} href="#contacto">Cuéntanos tu proyecto</a><MobileMenu /></header>; }
