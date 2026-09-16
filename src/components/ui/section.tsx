import type { ComponentPropsWithoutRef } from "react";
import { Container } from "./container";
import styles from "./section.module.css";

type SectionProps = ComponentPropsWithoutRef<"section"> & { contained?: boolean };

export function Section({ children, className, contained = true, ...props }: SectionProps) {
  const classes = [styles.section, className].filter(Boolean).join(" ");
  const content = <div className={classes}>{children}</div>;
  return <section {...props}>{contained ? <Container>{content}</Container> : content}</section>;
}
