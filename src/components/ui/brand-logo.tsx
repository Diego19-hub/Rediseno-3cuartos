import Image from "next/image";
import styles from "./brand-logo.module.css";

type BrandLogoProps = {
  tone?: "blue" | "light";
  className?: string;
};

export function BrandLogo({ tone = "blue", className }: BrandLogoProps) {
  return <Image className={`${styles.logo} ${tone === "light" ? styles.light : ""} ${className ?? ""}`} src="/images/logo3cuartos.png" alt="3cuartos" width={355} height={312} />;
}
