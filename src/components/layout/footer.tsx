import Link from "next/link";
import styles from "./layout.module.css";
export function Footer() { return <footer className={styles.footer}><strong>3cuartos</strong><span>Contenido provisional — cliente</span><Link href="/aviso-de-privacidad">Aviso de privacidad</Link></footer>; }
