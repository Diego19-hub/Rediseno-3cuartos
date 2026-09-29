"use client";

import Link from "next/link";
import styles from "./about-manifesto-scene.module.css";

type ManifestoSceneProps = {
  capabilities: Array<{ discipline: string; capability: string; href: string }>;
};

type ManifestoMoment = {
  marker: string;
  label?: string;
  title: string;
  copy: string;
  dark?: boolean;
};

const moments: ManifestoMoment[] = [
  {
    marker: "01 / QUIÉNES SOMOS",
    label: "3Cuartos",
    title: "Ideas, sistemas y experiencias con una dirección común.",
    copy: "Desarrollamos soluciones y activos digitales orientados a objetivos empresariales, conectando estrategia, creatividad y tecnología.",
  },
  {
    marker: "02 / POR QUÉ 3CUARTOS",
    label: "Una idea compartida",
    title: "El nombre abre una forma de mirar el conjunto.",
    copy: "La historia oficial de 3Cuartos tendrá aquí su espacio cuando exista una versión validada para compartir.",
    dark: true,
  },
  {
    marker: "03 / NUESTRA FORMA DE PENSAR",
    title: "Tres capacidades que trabajan como un sistema.",
    copy: "Cada proyecto puede necesitar una combinación distinta. La dirección compartida mantiene conectadas las decisiones.",
  },
];

export function AboutManifestoScene({ capabilities }: ManifestoSceneProps) {
  return <div className={styles.staticStack}>{moments.map((moment, index) => <article className={`${styles.moment} ${moment.dark ? styles.dark : ""}`} key={moment.marker}><ManifestoContent moment={moment} capabilities={index === 2 ? capabilities : undefined} /></article>)}</div>;
}

function ManifestoContent({ moment, capabilities }: { moment: ManifestoMoment; capabilities?: ManifestoSceneProps["capabilities"] }) {
  return <>
    <div className={styles.marker}><span>{moment.marker}</span>{moment.label && <span>{moment.label}</span>}</div>
    <h2>{moment.title}</h2>
    <p className={styles.copy}>{moment.copy}</p>
    {capabilities ? <div className={styles.capabilities}>{capabilities.map((item, index) => <Link href={item.href} key={item.href}><span>0{index + 1}</span><strong>{item.discipline}</strong><small>{item.capability}</small><b aria-hidden="true">↗</b></Link>)}</div> : <span className={styles.rule} aria-hidden="true" />}
  </>;
}
