/* eslint-disable @next/next/no-img-element */

import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProvisionalBadge } from "@/components/ui/provisional-badge";
import type { TeamMember } from "@/types/wordpress";
import styles from "./nosotros.module.css";

type TeamSectionProps = {
  team: TeamMember[];
};

export function TeamSection({ team }: TeamSectionProps) {
  const visibleTeam = team.filter((member) => member.name.trim());
  if (visibleTeam.length === 0) return null;

  return (
    <section className={styles.teamSection} aria-labelledby="team-title">
      <div className={styles.teamHeader}>
        <h1 id="team-title"><span>Un equipo para</span><span>cada dirección.</span></h1>
      </div>
      <div className={styles.teamGrid}>
        {visibleTeam.map((member, index) => (
          <article className={styles.teamMember} key={member.id}>
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
          </article>
        ))}
      </div>
    </section>
  );
}
