"use client";
/* eslint-disable @next/next/no-img-element */

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import { EditorialScrollScene } from "@/components/motion/editorial-scroll-scene";
import type { TeamMember } from "@/types/wordpress";
import styles from "./nosotros.module.css";

type TeamSectionProps = {
  team: TeamMember[];
};

export function TeamSection({ team }: TeamSectionProps) {
  const visibleTeam = team.filter((member) => member.name.trim());
  if (visibleTeam.length === 0) return null;

  return (
    <EditorialScrollScene direction="left" className={styles.teamSection} aria-labelledby="team-title">
      <div className={styles.teamHeader}>
        <h1 id="team-title"><span>Un equipo para</span><span>cada dirección.</span></h1>
      </div>
      <div className={styles.teamGrid}>
        {visibleTeam.map((member, index) => (
          <TeamMemberMotion index={index} key={member.id}>
            <span className={styles.teamNumber}>{String(index + 1).padStart(2, "0")}</span>
            <div className={styles.teamMedia}>
              {member.image?.url ? (
                <img src={member.image.url} alt={member.image.alt || member.name} width={member.image.width || 800} height={member.image.height || 1000} />
              ) : (
                <MediaPlaceholder label={`Imagen de ${member.name} pendiente`} />
              )}
            </div>
            <div className={styles.teamInfo}>
              <h3>{member.name}</h3>
              {member.role ? <p>{member.role}</p> : null}
            </div>
            {member.isProvisional ? <ProvisionalBadge /> : null}
          </TeamMemberMotion>
        ))}
      </div>
    </EditorialScrollScene>
  );
}

function TeamMemberMotion({ children, index }: { children: ReactNode; index: number }) {
  const reduced = useReducedMotion() === true;
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.18"] });
  const direction = index % 2 === 0 ? -1 : 1;
  const distance = isMobile ? 4 : 12;
  const x = useTransform(scrollYProgress, [0, 0.35, 0.82, 1], [`${direction * distance}vw`, "0vw", "0vw", `${direction * -distance * 0.35}vw`]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.82, 1], [isMobile ? "3vh" : "10vh", "0vh", "0vh", isMobile ? "-1vh" : "-4vh"]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.82, 1], [isMobile ? 0.97 : 0.88, 1, 1, isMobile ? 0.99 : 0.95]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    updateMobile();
    mediaQuery.addEventListener("change", updateMobile);
    return () => mediaQuery.removeEventListener("change", updateMobile);
  }, []);

  return <motion.article ref={ref} className={styles.teamMember} style={reduced ? undefined : { x, y, scale }}>{children}</motion.article>;
}
