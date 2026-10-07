"use client";

import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { useMobileEditorialScroll } from "@/components/motion/use-mobile-editorial-scroll";
import styles from "./confidence-section.module.css";

export type ConfidenceBrand = {
  name: string;
  logo?: string;
  approved?: boolean;
};

type ConfidenceSectionProps = {
  brands?: readonly ConfidenceBrand[];
  mobileEditorialMotion?: boolean;
};

const homeBrands: readonly ConfidenceBrand[] = [
  { name: "Answare IT", logo: "/images/brand/answareit-display.png", approved: true },
  { name: "Calforce", approved: true },
  { name: "ReciclaGil", logo: "/images/brand/reciclagil-display.png", approved: true },
  { name: "Senderos del Roble", logo: "/images/brand/senderos-del-roble-display.png", approved: true },
];

function BrandSet({ brands, duplicate = false }: { brands: readonly ConfidenceBrand[]; duplicate?: boolean }) {
  return (
    <div className={styles.brandGroup} aria-hidden={duplicate}>
      {brands.map((brand) => (
        <div className={styles.brand} key={`${duplicate ? "duplicate-" : ""}${brand.name}`}>
          {brand.logo ? <Image src={brand.logo} alt={duplicate ? "" : brand.name} width={160} height={48} /> : <span>{brand.name}</span>}
        </div>
      ))}
    </div>
  );
}

export function ConfidenceBrandCarousel({ brands }: { brands: readonly ConfidenceBrand[] }) {
  const approvedBrands = brands.filter((brand) => brand.name.trim());
  if (approvedBrands.length === 0) return null;

  return (
    <div className={styles.brandRail} aria-label="Marcas participantes">
      <div className={styles.brandTrack}>
        <BrandSet brands={approvedBrands} />
        <BrandSet brands={approvedBrands} duplicate />
      </div>
    </div>
  );
}

export function ConfidenceSection({ brands = homeBrands, mobileEditorialMotion = false }: ConfidenceSectionProps) {
  const approvedBrands = brands.filter((brand) => brand.approved !== false && brand.name.trim());

  if (approvedBrands.length === 0) return null;

  if (mobileEditorialMotion) return <MobileConfidenceSection brands={approvedBrands} />;

  return (
    <section data-header-theme="light" id="confianza" className={styles.section} aria-labelledby="confidence-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="confidence-title">Marcas y colaboraciones</h2>
        </div>

        <ConfidenceBrandCarousel brands={approvedBrands} />
      </div>
    </section>
  );
}

function MobileConfidenceSection({ brands }: { brands: readonly ConfidenceBrand[] }) {
  const [ref, progress, reducedMotion] = useMobileEditorialScroll<HTMLElement>();
  const titleX = useTransform(progress, [0, 1], [-15, 8]);
  const titleY = useTransform(progress, [0, 1], [50, -10]);
  const railY = useTransform(progress, [0, 1], [48, -12]);
  const railScale = useTransform(progress, [0, 1], [0.95, 1]);
  const lineScale = useTransform(progress, [0, 1], [0.2, 1]);

  return <section ref={ref} data-header-theme="light" id="confianza" className={styles.section} aria-labelledby="confidence-title">
    <div className={`${styles.inner} ${styles.mobileMotionInner}`}>
      <motion.div className={styles.intro} style={reducedMotion ? undefined : { x: titleX, y: titleY }}>
        <h2 id="confidence-title">Marcas y colaboraciones</h2>
      </motion.div>
      <motion.div style={reducedMotion ? undefined : { y: railY, scale: railScale }}>
        <ConfidenceBrandCarousel brands={brands} />
      </motion.div>
      <motion.span className={styles.mobileRule} aria-hidden="true" style={reducedMotion ? undefined : { scaleX: lineScale }} />
    </div>
  </section>;
}
