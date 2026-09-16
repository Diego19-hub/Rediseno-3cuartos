import Link from "next/link";
import { MobileMenu } from "./mobile-menu";
import styles from "./layout.module.css";
export function Header() { return <header className={styles.header}><Link aria-label="3cuartos, inicio" className={styles.brand} href="/">3cuartos</Link><nav aria-label="Navegación principal" className={styles.desktop}><a href="#servicios">Servicios</a><a href="#casos">Casos</a><a href="#contacto">Contacto</a></nav><MobileMenu /></header>; }
