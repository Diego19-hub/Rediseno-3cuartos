import type { ComponentPropsWithoutRef, ElementType } from "react";
import styles from "./container.module.css";

type ContainerProps<T extends ElementType = "div"> = { as?: T } & ComponentPropsWithoutRef<T>;

export function Container<T extends ElementType = "div">({ as, className, ...props }: ContainerProps<T>) {
  const Component = as ?? "div";
  const classes = [styles.container, className].filter(Boolean).join(" ");
  return <Component className={classes} {...props} />;
}
