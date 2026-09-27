"use client";

import Image from "next/image";
import styles from "./confidence-section.module.css";

export type ConfidenceBrand = {
  name: string;
  logo?: string;
  approved?: boolean;
};

type ConfidenceSectionProps = {
  brands?: readonly ConfidenceBrand[];
  preview?: boolean;
};

const demoBrands: readonly ConfidenceBrand[] = [
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

export function ConfidenceSection({ brands = [], preview = false }: ConfidenceSectionProps) {
  const usingDemo = preview && brands.length === 0;
  const sourceBrands = usingDemo ? demoBrands : brands;
  const approvedBrands = sourceBrands.filter((brand) => (usingDemo || brand.approved) && brand.name.trim());

  if (approvedBrands.length === 0) return null;

  return (
    <section data-header-theme="light" id="confianza" className={styles.section} aria-labelledby="confidence-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <h2 id="confidence-title">La confianza se construye en equipo.</h2>
        </div>

        <ConfidenceBrandCarousel brands={approvedBrands} />
      </div>
    </section>
  );
}
